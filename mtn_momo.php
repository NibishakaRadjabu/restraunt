<?php
declare(strict_types=1);

final class MtnMomoException extends RuntimeException
{
    public function __construct(string $message, public readonly int $httpStatus = 0)
    {
        parent::__construct($message);
    }
}

function momoSettings(array $config): array
{
    $settings = $config['momo'] ?? [];
    $mode = $settings['mode'] ?? '';
    if (!in_array($mode, ['sandbox', 'production'], true)) {
        throw new RuntimeException('MTN payment mode must be configured as sandbox or production.');
    }
    if (!preg_match('/\A[a-z0-9_-]{1,40}\z/', (string)($settings['target_environment'] ?? ''))) {
        throw new RuntimeException('Configure the MTN target environment for your merchant account.');
    }
    $rate = $settings['rwf_per_usd'] ?? '';
    if (!is_numeric($rate) || !is_finite((float)$rate) || (float)$rate <= 0 || (float)$rate > 1000000) {
        throw new RuntimeException('Configure a valid MTN RWF-per-USD exchange rate.');
    }
    foreach (['subscription_key', 'api_user', 'api_key'] as $key) {
        if (!is_string($settings[$key] ?? null) || trim($settings[$key]) === '') {
            throw new RuntimeException('MTN Mobile Money server credentials are not configured.');
        }
    }
    if (!function_exists('curl_init')) {
        throw new RuntimeException('The PHP cURL extension is required for MTN Mobile Money.');
    }

    $settings['base_url'] = $mode === 'sandbox'
        ? 'https://sandbox.momodeveloper.mtn.com'
        : 'https://proxy.momoapi.mtn.com';
    $settings['rwf_per_usd'] = (float)$rate;
    return $settings;
}

function momoRequest(array $settings, string $method, string $path, array $headers = [], ?string $body = null): array
{
    $handle = curl_init($settings['base_url'] . $path);
    if ($handle === false) {
        throw new RuntimeException('Could not initialize the MTN payment request.');
    }
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
    ];
    if ($body !== null) {
        $options[CURLOPT_POSTFIELDS] = $body;
    }
    curl_setopt_array($handle, $options);
    $response = curl_exec($handle);
    $status = (int)curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    $curlError = curl_error($handle);
    curl_close($handle);
    if (!is_string($response)) {
        throw new MtnMomoException('MTN payment request failed before a response was received.', $status);
    }
    if ($status < 200 || $status >= 300) {
        throw new MtnMomoException('MTN payment service returned an error.', $status);
    }
    if ($response === '') {
        return ['status' => $status, 'body' => []];
    }
    $decoded = json_decode($response, true);
    if (!is_array($decoded)) {
        throw new MtnMomoException('MTN payment service returned an invalid response.', $status);
    }
    return ['status' => $status, 'body' => $decoded];
}

function momoAccessToken(array $settings): string
{
    $token = $_SESSION['momo_access_token'] ?? '';
    $expiresAt = (int)($_SESSION['momo_access_token_expires_at'] ?? 0);
    if (is_string($token) && $token !== '' && $expiresAt > time() + 30) {
        return $token;
    }

    $credentials = base64_encode($settings['api_user'] . ':' . $settings['api_key']);
    $response = momoRequest(
        $settings,
        'POST',
        '/collection/token/',
        [
            'Authorization: Basic ' . $credentials,
            'Ocp-Apim-Subscription-Key: ' . $settings['subscription_key'],
        ],
        ''
    );
    $accessToken = $response['body']['access_token'] ?? '';
    $expiresIn = (int)($response['body']['expires_in'] ?? 0);
    if (!is_string($accessToken) || $accessToken === '' || $expiresIn < 1) {
        throw new RuntimeException('MTN did not provide a usable payment access token.');
    }
    $_SESSION['momo_access_token'] = $accessToken;
    $_SESSION['momo_access_token_expires_at'] = time() + $expiresIn;
    return $accessToken;
}

function momoPaymentStatus(array $settings, string $referenceId): array
{
    $token = momoAccessToken($settings);
    return momoRequest(
        $settings,
        'GET',
        '/collection/v1_0/requesttopay/' . rawurlencode($referenceId),
        [
            'Authorization: Bearer ' . $token,
            'Ocp-Apim-Subscription-Key: ' . $settings['subscription_key'],
            'X-Target-Environment: ' . $settings['target_environment'],
        ]
    )['body'];
}
