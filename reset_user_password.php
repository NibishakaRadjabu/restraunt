<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit("Not found.\n");
}

$username = strtolower(trim($argv[1] ?? ''));
if (!preg_match('/\A[a-z0-9._-]{3,80}\z/', $username)) {
    fwrite(STDERR, "Usage: php reset_user_password.php <username>\n");
    exit(2);
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
$temporaryPassword = rtrim(strtr(base64_encode(random_bytes(24)), '+/', '-_'), '=');
$statement = $db->prepare(
    'UPDATE auth_users SET password_hash = ?, must_change_password = 1 WHERE username = ?'
);
$statement->execute([password_hash($temporaryPassword, PASSWORD_DEFAULT), $username]);
if ($statement->rowCount() !== 1) {
    fwrite(STDERR, "Account not found. No password was changed.\n");
    exit(1);
}
$audit = $db->prepare(
    'INSERT INTO audit_logs (actor_user_id, event, details) VALUES (NULL, "password_reset", ?)'
);
$audit->execute([$username]);

fwrite(STDOUT, "One-time temporary password for {$username}: {$temporaryPassword}\n");
fwrite(STDOUT, "Give it to the account owner privately. They must change it at next sign-in.\n");
