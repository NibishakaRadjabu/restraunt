<?php
declare(strict_types=1);
require_once __DIR__ . '/mtn_momo.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
$cookiePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/') . '/';
session_name('harbor_hearth_customer');
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => $cookiePath,
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Strict',
]);
if (!session_start()) {
    http_response_code(500);
    exit;
}
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function customerRespond(array $body, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function requireCustomerLocalRequest(): void
{
    if (!in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) {
        customerRespond(['error' => 'Customer ordering is currently available only on this computer.'], 403);
    }
}

function requireCustomerSameOrigin(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return;
    }
    $originHost = parse_url($origin, PHP_URL_HOST);
    $originPort = parse_url($origin, PHP_URL_PORT);
    $originScheme = parse_url($origin, PHP_URL_SCHEME);
    $requestHost = strtolower((string)parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST));
    $requestPort = parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_PORT);
    $requestScheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $originPort ??= $originScheme === 'https' ? 443 : 80;
    $requestPort ??= $requestScheme === 'https' ? 443 : 80;
    if (!is_string($originHost) || strtolower($originHost) !== $requestHost || $originPort !== $requestPort || $originScheme !== $requestScheme) {
        customerRespond(['error' => 'Cross-origin requests are not allowed.'], 403);
    }
}

function requireCustomerCsrf(): void
{
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if (!is_string($sent) || !is_string($expected) || !hash_equals($expected, $sent)) {
        customerRespond(['error' => 'Your security token expired. Refresh the page and try again.'], 403);
    }
}

function openCustomerDatabase(): PDO
{
    $config = require __DIR__ . '/config.php';
    return new PDO(
        "mysql:host={$config['host']};port={$config['port']};dbname={$config['name']};charset=utf8mb4",
        $config['user'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}

function normalizeCustomerPhone(string $phone): string
{
    $phone = trim($phone);
    if (!preg_match('/\A\+?[0-9][0-9\s().-]{6,30}\z/', $phone)) {
        throw new InvalidArgumentException('Enter a valid phone number.');
    }
    $normalized = preg_replace('/[\s().-]/', '', $phone);
    if (!is_string($normalized) || !preg_match('/\A\+?[0-9]{7,15}\z/', $normalized)) {
        throw new InvalidArgumentException('Enter a valid phone number with 7-15 digits.');
    }
    return $normalized;
}

function customerFromSession(PDO $db): ?array
{
    $customerId = (int)($_SESSION['customer_id'] ?? 0);
    if ($customerId < 1) {
        return null;
    }
    $query = $db->prepare('SELECT id, name, phone FROM customers WHERE id = ? AND active = 1');
    $query->execute([$customerId]);
    $customer = $query->fetch();
    if (!$customer) {
        unset($_SESSION['customer_id']);
        session_regenerate_id(true);
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        return null;
    }
    $customer['id'] = (int)$customer['id'];
    return $customer;
}

function customerSignIn(PDO $db, array $input): void
{
    $phone = normalizeCustomerPhone((string)($input['phone'] ?? ''));
    $password = (string)($input['password'] ?? '');
    if ($password === '' || strlen($password) > 1024) {
        customerRespond(['error' => 'Phone number or password is incorrect.'], 401);
    }
    $phoneKey = hash('sha256', $phone);
    $attempts = $db->prepare(
        'SELECT COUNT(*) FROM customer_login_attempts
         WHERE phone_key = ? AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)'
    );
    $attempts->execute([$phoneKey]);
    if ((int)$attempts->fetchColumn() >= 8) {
        customerRespond(['error' => 'Too many sign-in attempts. Wait 15 minutes and try again.'], 429);
    }

    $query = $db->prepare('SELECT id, name, phone, password_hash, active FROM customers WHERE phone = ?');
    $query->execute([$phone]);
    $customer = $query->fetch();
    if (!$customer || !(bool)$customer['active'] || !password_verify($password, $customer['password_hash'])) {
        $failure = $db->prepare('INSERT INTO customer_login_attempts (phone_key) VALUES (?)');
        $failure->execute([$phoneKey]);
        customerRespond(['error' => 'Phone number or password is incorrect.'], 401);
    }

    session_regenerate_id(true);
    $_SESSION['customer_id'] = (int)$customer['id'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    $db->prepare('DELETE FROM customer_login_attempts WHERE phone_key = ?')->execute([$phoneKey]);
    $db->prepare('UPDATE customers SET last_login_at = NOW() WHERE id = ?')->execute([(int)$customer['id']]);
    customerRespond([
        'authenticated' => true,
        'csrfToken' => $_SESSION['csrf_token'],
        'customer' => ['id' => (int)$customer['id'], 'name' => $customer['name'], 'phone' => $customer['phone']],
    ]);
}

function customerRegister(PDO $db, array $input): void
{
    $name = trim((string)($input['name'] ?? ''));
    $phone = normalizeCustomerPhone((string)($input['phone'] ?? ''));
    $password = (string)($input['password'] ?? '');
    if ($name === '' || mb_strlen($name) > 120) {
        throw new InvalidArgumentException('Enter your name (up to 120 characters).');
    }
    if (strlen($password) < 12 || strlen($password) > 1024 || !preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        throw new InvalidArgumentException('Use at least 12 characters with both letters and numbers.');
    }
    $insert = $db->prepare('INSERT INTO customers (name, phone, password_hash) VALUES (?, ?, ?)');
    $insert->execute([$name, $phone, password_hash($password, PASSWORD_DEFAULT)]);
    $customerId = (int)$db->lastInsertId();
    session_regenerate_id(true);
    $_SESSION['customer_id'] = $customerId;
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    customerRespond([
        'authenticated' => true,
        'csrfToken' => $_SESSION['csrf_token'],
        'customer' => ['id' => $customerId, 'name' => $name, 'phone' => $phone],
    ], 201);
}

function customerOrders(PDO $db, int $customerId): array
{
    $ordersQuery = $db->prepare(
        'SELECT o.id, o.total_amount AS total, o.status AS kitchenStatus, o.order_date AS date,
                DATE_FORMAT(o.created_at, "%l:%i %p") AS time, o.delivery_address AS address,
                o.delivery_notes AS notes, d.status AS deliveryStatus,
                p.payment_method AS paymentMethod, mt.amount_rwf AS amountRwf
         FROM orders o
         JOIN deliveries d ON d.order_id = o.id
         LEFT JOIN payments p ON p.order_id = o.id
         LEFT JOIN momo_payment_transactions mt ON mt.order_id = o.id
         WHERE o.customer_id = ? AND o.order_type = "Delivery"
         ORDER BY o.id DESC LIMIT 50'
    );
    $ordersQuery->execute([$customerId]);
    $orders = $ordersQuery->fetchAll();
    if (!$orders) {
        return [];
    }
    $ids = array_column($orders, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $itemsQuery = $db->prepare(
        "SELECT order_id, food_id AS foodId, food_name AS name, unit_price AS price, quantity
         FROM order_items WHERE order_id IN ({$placeholders}) ORDER BY id"
    );
    $itemsQuery->execute($ids);
    $items = [];
    foreach ($itemsQuery->fetchAll() as $item) {
        $item['foodId'] = $item['foodId'] === null ? null : (int)$item['foodId'];
        $item['price'] = (float)$item['price'];
        $item['quantity'] = (int)$item['quantity'];
        $items[(int)$item['order_id']][] = $item;
    }
    foreach ($orders as &$order) {
        $order['id'] = (int)$order['id'];
        $order['total'] = (float)$order['total'];
        $order['amountRwf'] = $order['amountRwf'] === null ? null : (int)$order['amountRwf'];
        $order['items'] = $items[$order['id']] ?? [];
    }
    unset($order);
    return $orders;
}

function customerUuid(): string
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);
    return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-' . substr($hex, 12, 4) . '-' . substr($hex, 16, 4) . '-' . substr($hex, 20);
}

function customerMomoExternalId(string $paymentId): string
{
    return 'HH' . substr(str_replace('-', '', $paymentId), 0, 20);
}

function customerPaymentView(array $payment): array
{
    return [
        'paymentId' => $payment['payment_id'],
        'status' => $payment['status'],
        'amountUsd' => (float)$payment['amount_usd'],
        'amountRwf' => (int)$payment['amount_rwf'],
        'currency' => $payment['currency'],
        'orderId' => $payment['order_id'] === null ? null : (int)$payment['order_id'],
    ];
}

function createCustomerPayment(PDO $db, array $input, array $customer, array $appConfig): void
{
    $address = trim((string)($input['address'] ?? ''));
    $notes = trim((string)($input['notes'] ?? ''));
    $phone = normalizeCustomerPhone((string)($input['phone'] ?? ''));
    $items = $input['items'] ?? null;
    $idempotencyKey = strtolower(trim((string)($input['idempotencyKey'] ?? '')));
    if ($address === '' || mb_strlen($address) > 500) {
        throw new InvalidArgumentException('Enter a delivery address (up to 500 characters).');
    }
    if (mb_strlen($notes) > 1000) {
        throw new InvalidArgumentException('Order notes must be 1000 characters or fewer.');
    }
    if (!is_array($items) || count($items) < 1 || count($items) > 30) {
        throw new InvalidArgumentException('Add at least one menu item to your order.');
    }
    if (!preg_match('/\A[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\z/', $idempotencyKey)) {
        throw new InvalidArgumentException('Refresh checkout and try again.');
    }

    $settings = momoSettings($appConfig);
    $existingQuery = $db->prepare('SELECT * FROM momo_payment_transactions WHERE customer_id = ? AND idempotency_key = ?');
    $existingQuery->execute([$customer['id'], $idempotencyKey]);
    $existing = $existingQuery->fetch();
    if ($existing) {
        if ($existing['status'] === 'FAILED' || $existing['status'] === 'REVIEW') {
            throw new InvalidArgumentException('This payment attempt cannot be reused. Start checkout again.');
        }
        customerRespond(['payment' => customerPaymentView($existing)]);
    }
    $activeQuery = $db->prepare(
        'SELECT * FROM momo_payment_transactions
         WHERE customer_id = ? AND status IN ("INITIATING", "PENDING")
         ORDER BY created_at DESC LIMIT 1'
    );
    $activeQuery->execute([$customer['id']]);
    $activePayment = $activeQuery->fetch();
    if ($activePayment) {
        customerRespond(['payment' => customerPaymentView($activePayment)], 202);
    }

    $db->beginTransaction();
    try {
        $totalCents = 0;
        $orderItems = [];
        $foodQuery = $db->prepare('SELECT id, name, price FROM foods WHERE id = ? AND active = 1 FOR UPDATE');
        foreach ($items as $item) {
            if (!is_array($item)) {
                throw new InvalidArgumentException('Invalid order item.');
            }
            $foodId = (int)($item['foodId'] ?? 0);
            $quantity = (int)($item['quantity'] ?? 0);
            if ($foodId < 1 || $quantity < 1 || $quantity > 99) {
                throw new InvalidArgumentException('Choose valid menu items and quantities.');
            }
            $foodQuery->execute([$foodId]);
            $food = $foodQuery->fetch();
            if (!$food) {
                throw new InvalidArgumentException('A selected menu item is no longer available.');
            }
            $unitCents = (int)round((float)$food['price'] * 100);
            $subtotalCents = $unitCents * $quantity;
            $totalCents += $subtotalCents;
            $orderItems[] = [
                'foodId' => (int)$food['id'],
                'name' => (string)$food['name'],
                'price' => $unitCents / 100,
                'quantity' => $quantity,
                'subtotal' => $subtotalCents / 100,
            ];
        }
        $totalUsd = $totalCents / 100;
        $amountRwf = (int)round($totalUsd * $settings['rwf_per_usd']);
        if ($amountRwf < 1) {
            throw new InvalidArgumentException('The payment total is too small for Mobile Money.');
        }
        $paymentId = customerUuid();
        $referenceId = customerUuid();
        $insert = $db->prepare(
            'INSERT INTO momo_payment_transactions
             (payment_id, reference_id, idempotency_key, customer_id, customer_phone, amount_usd,
              amount_rwf, exchange_rate, currency, status, items_json, delivery_address, delivery_notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, "RWF", "INITIATING", ?, ?, ?)'
        );
        $insert->execute([
            $paymentId,
            $referenceId,
            $idempotencyKey,
            $customer['id'],
            $phone,
            number_format($totalUsd, 2, '.', ''),
            $amountRwf,
            number_format($settings['rwf_per_usd'], 4, '.', ''),
            json_encode($orderItems, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE),
            $address,
            $notes,
        ]);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        if ($error instanceof PDOException && (string)$error->getCode() === '23000') {
            $existingQuery->execute([$customer['id'], $idempotencyKey]);
            $existing = $existingQuery->fetch();
            if ($existing && !in_array($existing['status'], ['FAILED', 'REVIEW'], true)) {
                customerRespond(['payment' => customerPaymentView($existing)], 202);
            }
        }
        throw $error;
    }

    try {
        $token = momoAccessToken($settings);
    } catch (Throwable $error) {
        $db->prepare('UPDATE momo_payment_transactions SET status = "FAILED", provider_status = "AUTH_ERROR" WHERE payment_id = ?')
            ->execute([$paymentId]);
        error_log('MTN Mobile Money authentication failed before payment request.');
        throw new RuntimeException('MTN Mobile Money is not ready. Check the server-side provider configuration.');
    }

    $externalId = customerMomoExternalId($paymentId);
    try {
        $response = momoRequest(
            $settings,
            'POST',
            '/collection/v1_0/requesttopay',
            [
                'Authorization: Bearer ' . $token,
                'X-Reference-Id: ' . $referenceId,
                'X-Target-Environment: ' . $settings['target_environment'],
                'Ocp-Apim-Subscription-Key: ' . $settings['subscription_key'],
                'Content-Type: application/json',
                'Accept: application/json',
            ],
            json_encode([
                'amount' => (string)$amountRwf,
                'currency' => 'RWF',
                'externalId' => $externalId,
                'payer' => ['partyIdType' => 'MSISDN', 'partyId' => ltrim($phone, '+')],
                'payerMessage' => 'Harbor and Hearth food order',
                'payeeNote' => 'Harbor and Hearth order',
            ], JSON_THROW_ON_ERROR)
        );
        $providerStatus = $response['status'] === 202 ? 'PENDING' : 'UNKNOWN';
        $db->prepare('UPDATE momo_payment_transactions SET status = "PENDING", provider_status = ? WHERE payment_id = ?')
            ->execute([$providerStatus, $paymentId]);
    } catch (MtnMomoException $error) {
        if ($error->httpStatus >= 400 && $error->httpStatus < 500) {
            $db->prepare('UPDATE momo_payment_transactions SET status = "FAILED", provider_status = "REJECTED" WHERE payment_id = ?')
                ->execute([$paymentId]);
            throw new InvalidArgumentException('MTN rejected the payment request. Check the mobile number and try checkout again.');
        }
        $db->prepare('UPDATE momo_payment_transactions SET status = "PENDING", provider_status = "UNKNOWN" WHERE payment_id = ?')
            ->execute([$paymentId]);
    } catch (Throwable $error) {
        $db->prepare('UPDATE momo_payment_transactions SET status = "PENDING", provider_status = "UNKNOWN" WHERE payment_id = ?')
            ->execute([$paymentId]);
        error_log('MTN payment request response was uncertain; transaction status will be checked before retrying.');
    }

    $query = $db->prepare('SELECT * FROM momo_payment_transactions WHERE payment_id = ?');
    $query->execute([$paymentId]);
    customerRespond(['payment' => customerPaymentView($query->fetch())], 202);
}

function finishCustomerMomoOrder(PDO $db, string $paymentId, string $providerStatus, array $provider): ?int
{
    $db->beginTransaction();
    try {
        $query = $db->prepare(
            'SELECT mt.*, c.name AS customer_name
             FROM momo_payment_transactions mt
             JOIN customers c ON c.id = mt.customer_id
             WHERE mt.payment_id = ? FOR UPDATE'
        );
        $query->execute([$paymentId]);
        $payment = $query->fetch();
        if (!$payment) {
            throw new InvalidArgumentException('Payment attempt not found.');
        }
        if ($payment['order_id'] !== null) {
            $orderId = (int)$payment['order_id'];
            $db->commit();
            return $orderId;
        }
        if (in_array($payment['status'], ['FAILED', 'REVIEW'], true)) {
            $db->commit();
            return null;
        }

        $items = json_decode($payment['items_json'], true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($items) || $items === []) {
            throw new RuntimeException('The stored paid order has no valid items.');
        }
        $insertOrder = $db->prepare(
            'INSERT INTO orders
             (customer_name, order_type, table_id, total_amount, status, order_date, customer_id, customer_phone, delivery_address, delivery_notes)
             VALUES (?, "Delivery", NULL, ?, "New", ?, ?, ?, ?, ?)'
        );
        $insertOrder->execute([
            $payment['customer_name'],
            $payment['amount_usd'],
            date('Y-m-d'),
            $payment['customer_id'],
            $payment['customer_phone'],
            $payment['delivery_address'],
            $payment['delivery_notes'],
        ]);
        $orderId = (int)$db->lastInsertId();
        $insertItem = $db->prepare(
            'INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity, subtotal)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        foreach ($items as $item) {
            $insertItem->execute([
                $orderId,
                $item['foodId'],
                $item['name'],
                $item['price'],
                $item['quantity'],
                $item['subtotal'],
            ]);
        }
        $db->prepare('INSERT INTO deliveries (order_id, status) VALUES (?, "Pending")')->execute([$orderId]);
        $db->prepare('INSERT INTO payments (order_id, amount, payment_method) VALUES (?, ?, "Mobile Money")')
            ->execute([$orderId, $payment['amount_usd']]);
        $update = $db->prepare(
            'UPDATE momo_payment_transactions
             SET order_id = ?, status = "SUCCESSFUL", provider_status = ?,
                 provider_amount_rwf = ?, provider_currency = ?, provider_transaction_id = ?
             WHERE payment_id = ?'
        );
        $update->execute([
            $orderId,
            $providerStatus,
            (int)round((float)$provider['amount']),
            strtoupper((string)$provider['currency']),
            mb_substr((string)($provider['financialTransactionId'] ?? ''), 0, 120),
            $paymentId,
        ]);
        $db->commit();
        return $orderId;
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
}

function checkCustomerPayment(PDO $db, array $input, array $customer, array $appConfig): void
{
    $paymentId = strtolower(trim((string)($input['paymentId'] ?? '')));
    if (!preg_match('/\A[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\z/', $paymentId)) {
        throw new InvalidArgumentException('Choose a valid payment attempt.');
    }
    $query = $db->prepare('SELECT * FROM momo_payment_transactions WHERE payment_id = ? AND customer_id = ?');
    $query->execute([$paymentId, $customer['id']]);
    $payment = $query->fetch();
    if (!$payment) {
        throw new InvalidArgumentException('Payment attempt not found. Sign in with the account that started checkout.');
    }
    if ($payment['status'] === 'SUCCESSFUL') {
        customerRespond(['payment' => customerPaymentView($payment)]);
    }
    if ($payment['status'] === 'FAILED') {
        customerRespond(['payment' => customerPaymentView($payment)]);
    }
    if ($payment['status'] === 'REVIEW') {
        customerRespond(['payment' => customerPaymentView($payment), 'reviewRequired' => true]);
    }

    $settings = momoSettings($appConfig);
    try {
        $provider = momoPaymentStatus($settings, $payment['reference_id']);
    } catch (MtnMomoException $error) {
        error_log('MTN payment status could not be checked; HTTP status ' . $error->httpStatus . '.');
        customerRespond(['error' => 'MTN payment status is temporarily unavailable. Retry the status check; do not start a second payment.'], 503);
    }
    $providerStatus = strtoupper((string)($provider['status'] ?? 'PENDING'));
    if ($providerStatus === 'FAILED') {
        $db->prepare('UPDATE momo_payment_transactions SET status = "FAILED", provider_status = ? WHERE payment_id = ?')
            ->execute([$providerStatus, $paymentId]);
        $query->execute([$paymentId, $customer['id']]);
        customerRespond(['payment' => customerPaymentView($query->fetch())]);
    }
    if ($providerStatus !== 'SUCCESSFUL') {
        $db->prepare('UPDATE momo_payment_transactions SET status = "PENDING", provider_status = ? WHERE payment_id = ?')
            ->execute([mb_substr($providerStatus, 0, 32), $paymentId]);
        $query->execute([$paymentId, $customer['id']]);
        customerRespond(['payment' => customerPaymentView($query->fetch())]);
    }

    $amountMatches = isset($provider['amount']) && is_numeric($provider['amount'])
        && (int)round((float)$provider['amount']) === (int)$payment['amount_rwf'];
    $currencyMatches = strtoupper((string)($provider['currency'] ?? '')) === $payment['currency'];
    $externalIdMatches = hash_equals(customerMomoExternalId($paymentId), (string)($provider['externalId'] ?? ''));
    if (!$amountMatches || !$currencyMatches || !$externalIdMatches) {
        $review = $db->prepare(
            'UPDATE momo_payment_transactions
             SET status = "REVIEW", provider_status = "SUCCESSFUL_MISMATCH",
                 provider_amount_rwf = ?, provider_currency = ?, provider_transaction_id = ?
             WHERE payment_id = ?'
        );
        $review->execute([
            isset($provider['amount']) && is_numeric($provider['amount']) ? (int)round((float)$provider['amount']) : null,
            isset($provider['currency']) ? strtoupper((string)$provider['currency']) : null,
            mb_substr((string)($provider['financialTransactionId'] ?? ''), 0, 120),
            $paymentId,
        ]);
        error_log('MTN reported a successful payment that did not match the stored order amount, currency or reference.');
        customerRespond([
            'payment' => ['paymentId' => $paymentId, 'status' => 'REVIEW'],
            'reviewRequired' => true,
        ]);
    }

    $orderId = finishCustomerMomoOrder(
        $db,
        $paymentId,
        $providerStatus,
        $provider
    );
    $query->execute([$paymentId, $customer['id']]);
    customerRespond(['payment' => customerPaymentView($query->fetch()), 'orderId' => $orderId]);
}

requireCustomerLocalRequest();
try {
    $appConfig = require __DIR__ . '/config.php';
    $db = openCustomerDatabase();
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $action = $_GET['action'] ?? '';
        if ($action === 'menu') {
            $foods = $db->query(
                'SELECT id, name, category, price, image, description FROM foods WHERE active = 1 ORDER BY category, name'
            )->fetchAll();
            foreach ($foods as &$food) {
                $food['id'] = (int)$food['id'];
                $food['price'] = (float)$food['price'];
            }
            unset($food);
            customerRespond([
                'foods' => $foods,
                'payment' => ['currency' => 'RWF', 'rwfPerUsd' => (float)($appConfig['momo']['rwf_per_usd'] ?? 1470)],
                'csrfToken' => $_SESSION['csrf_token'],
            ]);
        }
        $customer = customerFromSession($db);
        if ($action === 'session') {
            customerRespond(['authenticated' => $customer !== null, 'customer' => $customer, 'csrfToken' => $_SESSION['csrf_token']]);
        }
        if (!$customer) {
            customerRespond(['error' => 'Sign in to view your account.'], 401);
        }
        if ($action === 'orders') {
            customerRespond(['orders' => customerOrders($db, $customer['id'])]);
        }
        if ($action === 'favorites') {
            $query = $db->prepare('SELECT food_id FROM customer_favorites WHERE customer_id = ? ORDER BY created_at DESC');
            $query->execute([$customer['id']]);
            customerRespond(['foodIds' => array_map('intval', $query->fetchAll(PDO::FETCH_COLUMN))]);
        }
        customerRespond(['error' => 'Unknown operation.'], 400);
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Allow: GET, POST');
        customerRespond(['error' => 'Method not allowed.'], 405);
    }
    requireCustomerSameOrigin();
    if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
        customerRespond(['error' => 'Content-Type must be application/json.'], 415);
    }
    if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 1048576) {
        customerRespond(['error' => 'Request body is too large.'], 413);
    }
    requireCustomerCsrf();
    $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($input)) {
        throw new InvalidArgumentException('Invalid request body.');
    }
    $action = $input['action'] ?? '';
    if ($action === 'register') {
        customerRegister($db, $input);
    }
    if ($action === 'login') {
        customerSignIn($db, $input);
    }

    $customer = customerFromSession($db);
    if (!$customer) {
        customerRespond(['error' => 'Sign in to continue.'], 401);
    }
    if ($action === 'logout') {
        unset($_SESSION['customer_id']);
        session_regenerate_id(true);
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        customerRespond(['authenticated' => false, 'csrfToken' => $_SESSION['csrf_token']]);
    }
    if ($action === 'start_payment') {
        createCustomerPayment($db, $input, $customer, $appConfig);
    }
    if ($action === 'check_payment') {
        checkCustomerPayment($db, $input, $customer, $appConfig);
    }
    if ($action === 'toggle_favorite') {
        $foodId = (int)($input['foodId'] ?? 0);
        $food = $db->prepare('SELECT id FROM foods WHERE id = ? AND active = 1');
        $food->execute([$foodId]);
        if (!$food->fetchColumn()) {
            throw new InvalidArgumentException('That menu item is not available.');
        }
        $favorite = $db->prepare('SELECT 1 FROM customer_favorites WHERE customer_id = ? AND food_id = ?');
        $favorite->execute([$customer['id'], $foodId]);
        if ($favorite->fetchColumn()) {
            $db->prepare('DELETE FROM customer_favorites WHERE customer_id = ? AND food_id = ?')->execute([$customer['id'], $foodId]);
            customerRespond(['favorite' => false]);
        }
        $db->prepare('INSERT INTO customer_favorites (customer_id, food_id) VALUES (?, ?)')->execute([$customer['id'], $foodId]);
        customerRespond(['favorite' => true]);
    }
    customerRespond(['error' => 'Unknown operation.'], 400);
} catch (InvalidArgumentException $error) {
    customerRespond(['error' => $error->getMessage()], 422);
} catch (JsonException) {
    customerRespond(['error' => 'Request body must be valid JSON.'], 400);
} catch (PDOException $error) {
    if ((string)$error->getCode() === '23000') {
        customerRespond(['error' => 'An account already uses that phone number.'], 409);
    }
    error_log('Customer ordering database error: ' . $error->getMessage());
    customerRespond(['error' => 'The customer service could not complete this request.'], 500);
} catch (RuntimeException $error) {
    error_log('Customer payment request failed: ' . $error->getMessage());
    customerRespond(['error' => $error->getMessage()], 503);
} catch (Throwable $error) {
    error_log('Customer ordering error: ' . $error->getMessage());
    customerRespond(['error' => 'The customer service could not complete this request.'], 500);
}
