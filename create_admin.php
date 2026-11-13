<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit("Not found.\n");
}

$config = require __DIR__ . '/config.php';
$db = new PDO(
    "mysql:host={$config['host']};port={$config['port']};dbname={$config['name']};charset=utf8mb4",
    $config['user'],
    $config['password'],
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]
);

$username = strtolower(trim($argv[1] ?? ''));
if (!preg_match('/\A[a-z0-9._-]{3,80}\z/', $username)) {
    fwrite(STDERR, "Usage: php create_admin.php <username> (3-80 letters, numbers, dots, underscores or hyphens)\n");
    exit(2);
}

if ((int)$db->query('SELECT COUNT(*) FROM auth_users')->fetchColumn() !== 0) {
    fwrite(STDERR, "An account already exists. Ask an active manager to create accounts in the Staff section.\n");
    exit(1);
}

$configuredPassword = getenv('RESTAURANT_INITIAL_ADMIN_PASSWORD');
$temporaryPassword = $configuredPassword === false || $configuredPassword === ''
    ? rtrim(strtr(base64_encode(random_bytes(24)), '+/', '-_'), '=')
    : $configuredPassword;
if (strlen($temporaryPassword) < 12 || strlen($temporaryPassword) > 1024 || !preg_match('/[A-Za-z]/', $temporaryPassword) || !preg_match('/[0-9]/', $temporaryPassword)) {
    fwrite(STDERR, "The initial password must be 12-1024 characters and include letters and numbers.\n");
    exit(2);
}

$statement = $db->prepare(
    'INSERT INTO auth_users (name, username, password_hash, role, active, must_change_password)
     VALUES (?, ?, ?, "manager", 1, 1)'
);
$statement->execute([$username, $username, password_hash($temporaryPassword, PASSWORD_DEFAULT)]);

fwrite(STDOUT, "Initial manager account created.\n");
fwrite(STDOUT, "Username: {$username}\n");
if ($configuredPassword === false || $configuredPassword === '') {
    fwrite(STDOUT, "One-time temporary password: {$temporaryPassword}\n");
} else {
    fwrite(STDOUT, "Password was read from RESTAURANT_INITIAL_ADMIN_PASSWORD and will not be displayed.\n");
}
fwrite(STDOUT, "Sign in locally and change the password immediately. Save this password now; it will not be shown again.\n");
