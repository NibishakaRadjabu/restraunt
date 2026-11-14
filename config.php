<?php
declare(strict_types=1);

return [
    'host' => getenv('RESTAURANT_DB_HOST') ?: '127.0.0.1',
    'port' => getenv('RESTAURANT_DB_PORT') ?: '3306',
    'name' => getenv('RESTAURANT_DB_NAME') ?: 'harbor_hearth_restored_20261113',
    'user' => getenv('RESTAURANT_DB_USER') ?: 'root',
    'password' => getenv('RESTAURANT_DB_PASSWORD') ?: '',
];
