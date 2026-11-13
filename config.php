<?php
declare(strict_types=1);

return [
    'host' => getenv('RESTAURANT_DB_HOST') ?: '127.0.0.1',
    'port' => getenv('RESTAURANT_DB_PORT') ?: '3306',
    'name' => getenv('RESTAURANT_DB_NAME') ?: 'harbor_hearth_restored_20261113',
    'user' => getenv('RESTAURANT_DB_USER') ?: 'root',
    'password' => getenv('RESTAURANT_DB_PASSWORD') ?: '',
    'momo' => [
        'mode' => strtolower(getenv('MTN_MOMO_MODE') ?: 'production'),
        'target_environment' => strtolower(getenv('MTN_MOMO_TARGET_ENVIRONMENT') ?: 'mtnrwanda'),
        'subscription_key' => getenv('MTN_MOMO_SUBSCRIPTION_KEY') ?: '',
        'api_user' => getenv('MTN_MOMO_API_USER') ?: '',
        'api_key' => getenv('MTN_MOMO_API_KEY') ?: '',
        'rwf_per_usd' => getenv('MTN_MOMO_RWF_PER_USD') ?: '1470',
    ],
];
