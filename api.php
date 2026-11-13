<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
$cookiePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/') . '/';
session_name('harbor_hearth_session');
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

function respond(array $body, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function uploadFoodImage(array $file): string
{
    $uploadError = $file['error'] ?? UPLOAD_ERR_NO_FILE;
    if ($uploadError === UPLOAD_ERR_INI_SIZE || $uploadError === UPLOAD_ERR_FORM_SIZE) {
        throw new InvalidArgumentException('The server upload limit was exceeded. Choose a smaller food photo.');
    }
    if ($uploadError !== UPLOAD_ERR_OK || !is_uploaded_file((string)($file['tmp_name'] ?? ''))) {
        throw new InvalidArgumentException('Choose a valid food photo and try again.');
    }
    if ((int)($file['size'] ?? 0) > 5 * 1024 * 1024) {
        throw new InvalidArgumentException('Food photos must be 5 MB or smaller.');
    }

    $imageInfo = getimagesize((string)$file['tmp_name']);
    $imageTypes = [
        IMAGETYPE_JPEG => ['mime' => 'image/jpeg', 'extension' => 'jpg'],
        IMAGETYPE_PNG => ['mime' => 'image/png', 'extension' => 'png'],
        IMAGETYPE_GIF => ['mime' => 'image/gif', 'extension' => 'gif'],
        IMAGETYPE_WEBP => ['mime' => 'image/webp', 'extension' => 'webp'],
    ];
    $imageType = is_array($imageInfo) ? ($imageInfo[2] ?? null) : null;
    if (!isset($imageTypes[$imageType]) || ($imageInfo['mime'] ?? '') !== $imageTypes[$imageType]['mime']) {
        throw new InvalidArgumentException('Use a JPEG, PNG, GIF, or WebP food photo.');
    }
    if ($imageInfo[0] > 6000 || $imageInfo[1] > 6000 || $imageInfo[0] * $imageInfo[1] > 25000000) {
        throw new InvalidArgumentException('Food photos must be no larger than 6000 × 6000 pixels.');
    }

    $directory = __DIR__ . '/uploads/food-images';
    if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
        throw new RuntimeException('The food photo folder could not be created.');
    }
    $filename = bin2hex(random_bytes(16)) . '.' . $imageTypes[$imageType]['extension'];
    if (!move_uploaded_file((string)$file['tmp_name'], $directory . '/' . $filename)) {
        throw new RuntimeException('The food photo could not be saved.');
    }
    return 'uploads/food-images/' . $filename;
}

function requireLocalRequest(): void
{
    $remoteAddress = $_SERVER['REMOTE_ADDR'] ?? '';
    if (!in_array($remoteAddress, ['127.0.0.1', '::1'], true)) {
        respond(['error' => 'This first setup is restricted to the local computer.'], 403);
    }
}

function requireSameOrigin(): void
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
        respond(['error' => 'Cross-origin requests are not allowed.'], 403);
    }
}

function requireCsrfToken(): void
{
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';
    if (!is_string($sent) || !is_string($expected) || $expected === '' || !hash_equals($expected, $sent)) {
        respond(['error' => 'Your security token expired. Refresh the page and try again.'], 403);
    }
}

function currentUser(PDO $db): ?array
{
    $userId = (int)($_SESSION['user_id'] ?? 0);
    if ($userId < 1) {
        return null;
    }
    $statement = $db->prepare(
        'SELECT id, name, username, role, active, must_change_password
         FROM auth_users WHERE id = ?'
    );
    $statement->execute([$userId]);
    $user = $statement->fetch();
    if (!$user || !(bool)$user['active']) {
        $_SESSION = [];
        session_regenerate_id(true);
        return null;
    }
    $user['id'] = (int)$user['id'];
    $user['active'] = (bool)$user['active'];
    $user['mustChangePassword'] = (bool)$user['must_change_password'];
    unset($user['must_change_password']);
    return $user;
}

function requireUser(PDO $db): array
{
    $user = currentUser($db);
    if (!$user) {
        respond(['error' => 'Please sign in to continue.', 'code' => 'authentication_required'], 401);
    }
    if ($user['mustChangePassword']) {
        respond(['error' => 'Change your temporary password before continuing.', 'code' => 'password_change_required'], 403);
    }
    return $user;
}

function requireRole(array $user, array $roles): void
{
    if (!in_array($user['role'], $roles, true)) {
        respond(['error' => 'Your account does not have permission to do that.'], 403);
    }
}

function writeAudit(PDO $db, ?int $userId, string $event, string $details = ''): void
{
    try {
        $statement = $db->prepare(
            'INSERT INTO audit_logs (actor_user_id, event, details) VALUES (?, ?, ?)'
        );
        $statement->execute([$userId, $event, mb_substr($details, 0, 500)]);
    } catch (Throwable $error) {
        error_log('Restaurant audit log write failed: ' . $error->getMessage());
    }
}

function authenticate(PDO $db, array $input): void
{
    requireSameOrigin();
    $db->exec('DELETE FROM auth_login_attempts WHERE attempted_at < DATE_SUB(NOW(), INTERVAL 7 DAY)');
    $username = strtolower(trim((string)($input['username'] ?? '')));
    $password = (string)($input['password'] ?? '');
    if (!preg_match('/\A[a-z0-9._-]{3,80}\z/', $username) || $password === '' || strlen($password) > 1024) {
        respond(['error' => 'Username or password is incorrect.'], 401);
    }
    $usernameKey = hash('sha256', $username);
    $attempts = $db->prepare(
        'SELECT COUNT(*) FROM auth_login_attempts
         WHERE username_key = ? AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)'
    );
    $attempts->execute([$usernameKey]);
    if ((int)$attempts->fetchColumn() >= 8) {
        respond(['error' => 'Too many sign-in attempts. Wait 15 minutes and try again.'], 429);
    }

    $statement = $db->prepare(
        'SELECT id, name, username, password_hash, role, active, must_change_password
         FROM auth_users WHERE username = ?'
    );
    $statement->execute([$username]);
    $user = $statement->fetch();
    if (!$user || !(bool)$user['active'] || !password_verify($password, $user['password_hash'])) {
        $failure = $db->prepare('INSERT INTO auth_login_attempts (username_key) VALUES (?)');
        $failure->execute([$usernameKey]);
        writeAudit($db, $user && (bool)$user['active'] ? (int)$user['id'] : null, 'login_failed');
        respond(['error' => 'Username or password is incorrect.'], 401);
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    $clearAttempts = $db->prepare('DELETE FROM auth_login_attempts WHERE username_key = ?');
    $clearAttempts->execute([$usernameKey]);
    $login = $db->prepare('UPDATE auth_users SET last_login_at = NOW() WHERE id = ?');
    $login->execute([(int)$user['id']]);
    writeAudit($db, (int)$user['id'], 'login_success');
    respond([
        'authenticated' => true,
        'csrfToken' => $_SESSION['csrf_token'],
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'username' => $user['username'],
            'role' => $user['role'],
            'mustChangePassword' => (bool)$user['must_change_password'],
        ],
    ]);
}

function changePassword(PDO $db, array $input, array $user): void
{
    $currentPassword = (string)($input['currentPassword'] ?? '');
    $newPassword = (string)($input['newPassword'] ?? '');
    $query = $db->prepare('SELECT password_hash FROM auth_users WHERE id = ?');
    $query->execute([$user['id']]);
    $passwordHash = $query->fetchColumn();
    if (!is_string($passwordHash) || !password_verify($currentPassword, $passwordHash)) {
        throw new InvalidArgumentException('Current password is incorrect.');
    }
    if (strlen($newPassword) < 12 || strlen($newPassword) > 1024 || !preg_match('/[A-Za-z]/', $newPassword) || !preg_match('/[0-9]/', $newPassword)) {
        throw new InvalidArgumentException('Use at least 12 characters with both letters and numbers.');
    }
    if (password_verify($newPassword, $passwordHash)) {
        throw new InvalidArgumentException('Choose a password you have not used before.');
    }
    $update = $db->prepare('UPDATE auth_users SET password_hash = ?, must_change_password = 0 WHERE id = ?');
    $update->execute([password_hash($newPassword, PASSWORD_DEFAULT), $user['id']]);
    session_regenerate_id(true);
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    writeAudit($db, $user['id'], 'password_changed');
    respond([
        'authenticated' => true,
        'csrfToken' => $_SESSION['csrf_token'],
        'user' => [...$user, 'mustChangePassword' => false],
    ]);
}

function createUser(PDO $db, array $input, array $actor): void
{
    $name = inputString($input, 'name', 120);
    $username = strtolower(inputString($input, 'username', 80));
    $password = (string)($input['password'] ?? '');
    $role = inputString($input, 'role', 20);
    if (!preg_match('/\A[a-z0-9._-]{3,80}\z/', $username)) {
        throw new InvalidArgumentException('Usernames must be 3-80 characters: letters, numbers, dots, underscores or hyphens.');
    }
    if (strlen($password) < 12 || strlen($password) > 1024 || !preg_match('/[A-Za-z]/', $password) || !preg_match('/[0-9]/', $password)) {
        throw new InvalidArgumentException('Set a temporary password with at least 12 characters, including letters and numbers.');
    }
    if (!in_array($role, ['manager', 'cashier', 'chef', 'waiter', 'driver'], true)) {
        throw new InvalidArgumentException('Choose a valid staff role.');
    }
    $statement = $db->prepare(
        'INSERT INTO auth_users (name, username, password_hash, role, active, must_change_password)
         VALUES (?, ?, ?, ?, 1, 1)'
    );
    $statement->execute([$name, $username, password_hash($password, PASSWORD_DEFAULT), $role]);
    writeAudit($db, $actor['id'], 'user_created', "{$username} ({$role})");
}

function setUserActive(PDO $db, array $input, array $actor): void
{
    $userId = (int)($input['id'] ?? 0);
    $active = filter_var($input['active'] ?? null, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    if ($userId < 1 || $active === null) {
        throw new InvalidArgumentException('Choose a valid account and status.');
    }
    if ($userId === $actor['id'] && !$active) {
        throw new InvalidArgumentException('You cannot disable your own account.');
    }
    $db->beginTransaction();
    try {
        $query = $db->prepare('SELECT role, active FROM auth_users WHERE id = ? FOR UPDATE');
        $query->execute([$userId]);
        $target = $query->fetch();
        if (!$target) {
            throw new InvalidArgumentException('Account not found.');
        }
        if ($target['role'] === 'driver' && (bool)$target['active'] && !$active) {
            $deliveries = $db->prepare(
                'SELECT COUNT(*) FROM deliveries
                 WHERE driver_user_id = ? AND status IN ("Assigned", "Accepted", "Picked up")'
            );
            $deliveries->execute([$userId]);
            if ((int)$deliveries->fetchColumn() > 0) {
                throw new InvalidArgumentException('Reassign active deliveries before disabling this driver.');
            }
        }
        if ($target['role'] === 'manager' && (bool)$target['active'] && !$active) {
            $managers = $db->query('SELECT id FROM auth_users WHERE role = "manager" AND active = 1 FOR UPDATE');
            if (count($managers->fetchAll()) <= 1) {
                throw new InvalidArgumentException('The last active manager account cannot be disabled.');
            }
        }
        $update = $db->prepare('UPDATE auth_users SET active = ? WHERE id = ?');
        $update->execute([$active ? 1 : 0, $userId]);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
    writeAudit($db, $actor['id'], $active ? 'user_enabled' : 'user_disabled', "User #{$userId}");
}

function assignDelivery(PDO $db, array $input, array $actor): void
{
    $orderId = (int)($input['orderId'] ?? 0);
    $driverId = (int)($input['driverId'] ?? 0);
    if ($orderId < 1 || $driverId < 1) {
        throw new InvalidArgumentException('Choose a delivery and an active driver.');
    }
    $db->beginTransaction();
    try {
        $orderQuery = $db->prepare('SELECT order_type, delivery_address FROM orders WHERE id = ? FOR UPDATE');
        $orderQuery->execute([$orderId]);
        $order = $orderQuery->fetch();
        if (!$order || $order['order_type'] !== 'Delivery' || $order['delivery_address'] === '') {
            throw new InvalidArgumentException('Only customer delivery orders with an address can be assigned.');
        }
        $driverQuery = $db->prepare('SELECT id FROM auth_users WHERE id = ? AND role = "driver" AND active = 1');
        $driverQuery->execute([$driverId]);
        if (!$driverQuery->fetchColumn()) {
            throw new InvalidArgumentException('Choose an active driver account.');
        }
        $deliveryQuery = $db->prepare('SELECT status FROM deliveries WHERE order_id = ? FOR UPDATE');
        $deliveryQuery->execute([$orderId]);
        $status = $deliveryQuery->fetchColumn();
        if ($status === false) {
            throw new InvalidArgumentException('Delivery record not found.');
        }
        if (!in_array($status, ['Pending', 'Assigned'], true)) {
            throw new InvalidArgumentException('A driver can only be assigned before accepting the delivery.');
        }
        $update = $db->prepare(
            'UPDATE deliveries SET driver_user_id = ?, status = "Assigned", assigned_at = NOW()
             WHERE order_id = ?'
        );
        $update->execute([$driverId, $orderId]);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
    writeAudit($db, $actor['id'], 'delivery_assigned', "Order #{$orderId} to driver #{$driverId}");
}

function updateDelivery(PDO $db, array $input, array $actor): void
{
    $deliveryId = (int)($input['id'] ?? 0);
    if ($deliveryId < 1) {
        throw new InvalidArgumentException('Choose a valid delivery.');
    }
    $db->beginTransaction();
    try {
        $query = $db->prepare(
            'SELECT d.status, d.driver_user_id, d.order_id, o.status AS kitchen_status
             FROM deliveries d JOIN orders o ON o.id = d.order_id
             WHERE d.id = ? FOR UPDATE'
        );
        $query->execute([$deliveryId]);
        $delivery = $query->fetch();
        if (!$delivery) {
            throw new InvalidArgumentException('Delivery not found.');
        }
        if ($actor['role'] === 'driver' && (int)$delivery['driver_user_id'] !== (int)$actor['id']) {
            throw new InvalidArgumentException('This delivery is not assigned to your account.');
        }
        $nextStatus = ['Assigned' => 'Accepted', 'Accepted' => 'Picked up', 'Picked up' => 'Delivered'][$delivery['status']] ?? null;
        if ($nextStatus === null) {
            throw new InvalidArgumentException('This delivery cannot advance from its current status.');
        }
        if ($nextStatus === 'Picked up' && $delivery['kitchen_status'] !== 'Ready') {
            throw new InvalidArgumentException('The kitchen must mark this order ready before pickup.');
        }
        $update = $db->prepare(
            'UPDATE deliveries SET status = ?,
               accepted_at = CASE WHEN ? = "Accepted" THEN NOW() ELSE accepted_at END,
               picked_up_at = CASE WHEN ? = "Picked up" THEN NOW() ELSE picked_up_at END,
               delivered_at = CASE WHEN ? = "Delivered" THEN NOW() ELSE delivered_at END
             WHERE id = ?'
        );
        $update->execute([$nextStatus, $nextStatus, $nextStatus, $nextStatus, $deliveryId]);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
    writeAudit($db, $actor['id'], 'delivery_status_updated', "Delivery #{$deliveryId}: {$nextStatus}");
}

function inputString(array $input, string $key, int $maxLength, bool $required = true): string
{
    $value = trim((string)($input[$key] ?? ''));
    if (($required && $value === '') || mb_strlen($value) > $maxLength) {
        throw new InvalidArgumentException("Enter a valid value for {$key}.");
    }
    return $value;
}

function inputNumber(array $input, string $key, float $minimum = 0): float
{
    $value = $input[$key] ?? null;
    if (!is_numeric($value) || !is_finite((float)$value) || (float)$value < $minimum) {
        throw new InvalidArgumentException("Enter a valid value for {$key}.");
    }
    return (float)$value;
}

function responseData(PDO $db, array $user): array
{
    $role = $user['role'];
    $foods = $db->query(
        'SELECT id, name, category, price, image, description, active FROM foods ORDER BY id'
    )->fetchAll();
    foreach ($foods as &$food) {
        $food['id'] = (int)$food['id'];
        $food['price'] = (float)$food['price'];
        $food['active'] = (bool)$food['active'];
    }
    unset($food);

    $tables = $db->query(
        'SELECT id, table_number AS number, seats, status FROM restaurant_tables ORDER BY table_number'
    )->fetchAll();
    foreach ($tables as &$table) {
        $table['id'] = (int)$table['id'];
        $table['seats'] = (int)$table['seats'];
    }
    unset($table);

    $ordersQuery = $db->prepare(
        'SELECT o.id, o.customer_name AS customer, o.order_type AS type, o.table_id AS tableId,
                o.total_amount AS total, o.status, o.order_date AS date,
                DATE_FORMAT(o.created_at, "%l:%i %p") AS time,
                CASE WHEN p.id IS NULL THEN "Unpaid" ELSE "Paid" END AS paymentStatus,
                d.status AS deliveryStatus, o.customer_phone AS customerPhone,
                o.delivery_address AS deliveryAddress
         FROM orders o
         LEFT JOIN payments p ON p.order_id = o.id
         LEFT JOIN deliveries d ON d.order_id = o.id
         WHERE (? <> "driver" OR d.driver_user_id = ?)
         ORDER BY o.id DESC'
    );
    $ordersQuery->execute([$role, (int)$user['id']]);
    $orders = $ordersQuery->fetchAll();
    $orderItems = $db->query(
        'SELECT order_id, food_id AS foodId, food_name AS name, unit_price AS price, quantity
         FROM order_items ORDER BY id'
    )->fetchAll();
    $itemsByOrder = [];
    foreach ($orderItems as $item) {
        $item['foodId'] = $item['foodId'] === null ? null : (int)$item['foodId'];
        $item['price'] = (float)$item['price'];
        $item['quantity'] = (int)$item['quantity'];
        $itemsByOrder[(int)$item['order_id']][] = $item;
    }
    foreach ($orders as &$order) {
        $order['id'] = (int)$order['id'];
        $order['tableId'] = $order['tableId'] === null ? null : (int)$order['tableId'];
        $order['total'] = (float)$order['total'];
        if ($role !== 'manager') {
            unset($order['customerPhone'], $order['deliveryAddress']);
        }
        $order['items'] = $itemsByOrder[$order['id']] ?? [];
    }
    unset($order);

    $deliveries = [];
    $drivers = [];
    if ($role === 'manager' || $role === 'driver') {
        $deliveryQuery = $db->prepare(
            'SELECT d.id, d.order_id AS orderId, d.driver_user_id AS driverId, d.status,
                    d.assigned_at AS assignedAt, o.customer_name AS customer,
                    o.customer_phone AS phone, o.delivery_address AS address, o.delivery_notes AS notes,
                    o.total_amount AS total, o.status AS kitchenStatus, o.order_date AS date,
                    DATE_FORMAT(o.created_at, "%l:%i %p") AS time, u.name AS driverName
             FROM deliveries d
             JOIN orders o ON o.id = d.order_id
             LEFT JOIN auth_users u ON u.id = d.driver_user_id
             WHERE (? <> "driver" OR d.driver_user_id = ?)
             ORDER BY d.id DESC'
        );
        $deliveryQuery->execute([$role, (int)$user['id']]);
        $deliveries = $deliveryQuery->fetchAll();
        foreach ($deliveries as &$delivery) {
            $delivery['id'] = (int)$delivery['id'];
            $delivery['orderId'] = (int)$delivery['orderId'];
            $delivery['driverId'] = $delivery['driverId'] === null ? null : (int)$delivery['driverId'];
            $delivery['total'] = (float)$delivery['total'];
            $delivery['items'] = $itemsByOrder[$delivery['orderId']] ?? [];
        }
        unset($delivery);
    }
    if ($role === 'manager') {
        $drivers = $db->query('SELECT id, name FROM auth_users WHERE role = "driver" AND active = 1 ORDER BY name')->fetchAll();
        foreach ($drivers as &$driver) {
            $driver['id'] = (int)$driver['id'];
        }
        unset($driver);
    }

    $payments = in_array($role, ['manager', 'cashier'], true)
        ? $db->query(
            'SELECT p.id, p.order_id AS orderId, p.amount, p.payment_method AS method,
                    p.customer_phone AS customerPhone, p.provider_reference AS providerReference,
                    DATE_FORMAT(p.payment_date, "%Y-%m-%d") AS date,
                    mt.amount_rwf AS amountRwf, mt.provider_transaction_id AS providerTransactionId
             FROM payments p
             LEFT JOIN momo_payment_transactions mt ON mt.order_id = p.order_id
             ORDER BY p.id'
        )->fetchAll()
        : [];
    foreach ($payments as &$payment) {
        $payment['id'] = (int)$payment['id'];
        $payment['orderId'] = (int)$payment['orderId'];
        $payment['amount'] = (float)$payment['amount'];
        $payment['customerPhone'] = $payment['customerPhone'] === null ? null : (string)$payment['customerPhone'];
        $payment['providerReference'] = $payment['providerReference'] === null ? null : (string)$payment['providerReference'];
        $payment['amountRwf'] = $payment['amountRwf'] === null ? null : (int)$payment['amountRwf'];
    }
    unset($payment);

    $momoReviews = $role === 'manager'
        ? $db->query(
            'SELECT mt.payment_id AS paymentId, c.name AS customer, mt.customer_phone AS phone,
                    mt.amount_rwf AS amountRwf, mt.currency, mt.provider_status AS providerStatus,
                    DATE_FORMAT(mt.updated_at, "%Y-%m-%d %H:%i") AS updatedAt
             FROM momo_payment_transactions mt
             JOIN customers c ON c.id = mt.customer_id
             WHERE mt.status = "REVIEW"
             ORDER BY mt.updated_at DESC'
        )->fetchAll()
        : [];
    foreach ($momoReviews as &$review) {
        $review['amountRwf'] = (int)$review['amountRwf'];
    }
    unset($review);

    $staff = in_array($role, ['manager'], true)
        ? $db->query('SELECT id, name, role, phone, salary FROM staff ORDER BY id')->fetchAll()
        : [];
    foreach ($staff as &$member) {
        $member['id'] = (int)$member['id'];
        $member['salary'] = (float)$member['salary'];
    }
    unset($member);

    $inventory = $role === 'manager'
        ? $db->query('SELECT id, name, unit, quantity, minimum, supplier FROM inventory ORDER BY id')->fetchAll()
        : [];
    foreach ($inventory as &$item) {
        $item['id'] = (int)$item['id'];
        $item['quantity'] = (float)$item['quantity'];
        $item['minimum'] = (float)$item['minimum'];
    }
    unset($item);

    $purchases = $role === 'manager'
        ? $db->query('SELECT p.id, i.name, i.unit, p.quantity, p.supplier, p.purchase_date AS date FROM purchases p JOIN inventory i ON i.id = p.inventory_id ORDER BY p.id')->fetchAll()
        : [];
    foreach ($purchases as &$purchase) {
        $purchase['id'] = (int)$purchase['id'];
        $purchase['quantity'] = (float)$purchase['quantity'];
    }
    unset($purchase);

    $users = [];
    if ($role === 'manager') {
        $users = $db->query(
            'SELECT id, name, username, role, active, must_change_password AS mustChangePassword, last_login_at AS lastLogin
             FROM auth_users ORDER BY name'
        )->fetchAll();
        foreach ($users as &$user) {
            $user['id'] = (int)$user['id'];
            $user['active'] = (bool)$user['active'];
            $user['mustChangePassword'] = (bool)$user['mustChangePassword'];
        }
        unset($user);
    }
    return compact('foods', 'tables', 'orders', 'payments', 'momoReviews', 'staff', 'inventory', 'purchases', 'users', 'deliveries', 'drivers');
}

function saveFood(PDO $db, array $input): void
{
    $id = (int)($input['id'] ?? 0);
    $name = inputString($input, 'name', 120);
    $category = inputString($input, 'category', 40);
    $price = inputNumber($input, 'price');
    $image = inputString($input, 'image', 255, false);
    $description = inputString($input, 'description', 2000, false);
    if ($id > 0) {
        $statement = $db->prepare('UPDATE foods SET name = ?, category = ?, price = ?, image = ?, description = ? WHERE id = ?');
        $statement->execute([$name, $category, $price, $image, $description, $id]);
        if ($statement->rowCount() === 0 && !foodExists($db, $id)) {
            throw new InvalidArgumentException('Food item not found.');
        }
        return;
    }
    $statement = $db->prepare('INSERT INTO foods (name, category, price, image, description) VALUES (?, ?, ?, ?, ?)');
    $statement->execute([$name, $category, $price, $image, $description]);
}

function foodExists(PDO $db, int $id): bool
{
    $statement = $db->prepare('SELECT 1 FROM foods WHERE id = ?');
    $statement->execute([$id]);
    return (bool)$statement->fetchColumn();
}

function saveTable(PDO $db, array $input): void
{
    $id = (int)($input['id'] ?? 0);
    $number = inputString($input, 'number', 20);
    $seats = (int)inputNumber($input, 'seats', 1);
    $status = inputString($input, 'status', 20);
    if (!in_array($status, ['Available', 'Occupied', 'Reserved'], true)) {
        throw new InvalidArgumentException('Choose a valid table status.');
    }
    if ($id > 0) {
        $statement = $db->prepare('UPDATE restaurant_tables SET table_number = ?, seats = ?, status = ? WHERE id = ?');
        $statement->execute([$number, $seats, $status, $id]);
        if ($statement->rowCount() === 0) {
            $check = $db->prepare('SELECT 1 FROM restaurant_tables WHERE id = ?');
            $check->execute([$id]);
            if (!$check->fetchColumn()) {
                throw new InvalidArgumentException('Table not found.');
            }
        }
    } else {
        $statement = $db->prepare('INSERT INTO restaurant_tables (table_number, seats, status) VALUES (?, ?, ?)');
        $statement->execute([$number, $seats, $status]);
    }
}

function createOrder(PDO $db, array $input): void
{
    $customer = inputString($input, 'customer', 120);
    $type = inputString($input, 'type', 20);
    if (!in_array($type, ['Dine-in', 'Takeaway', 'Delivery'], true)) {
        throw new InvalidArgumentException('Choose a valid order type.');
    }
    $tableId = isset($input['tableId']) && $input['tableId'] !== '' ? (int)$input['tableId'] : null;
    if ($type !== 'Dine-in') {
        $tableId = null;
    }
    $requestedItems = $input['items'] ?? [];
    if (!is_array($requestedItems) || count($requestedItems) === 0 || count($requestedItems) > 30) {
        throw new InvalidArgumentException('Add at least one menu item to the order.');
    }

    $db->beginTransaction();
    try {
        if ($tableId !== null) {
            $tableQuery = $db->prepare('SELECT status FROM restaurant_tables WHERE id = ? FOR UPDATE');
            $tableQuery->execute([$tableId]);
            $tableStatus = $tableQuery->fetchColumn();
            if ($tableStatus === false || $tableStatus === 'Occupied') {
                throw new InvalidArgumentException('Choose a table that is available or reserved.');
            }
        }

        $total = 0.0;
        $items = [];
        $foodQuery = $db->prepare('SELECT id, name, price FROM foods WHERE id = ? AND active = 1 FOR UPDATE');
        foreach ($requestedItems as $requestedItem) {
            if (!is_array($requestedItem)) {
                throw new InvalidArgumentException('Invalid order item.');
            }
            $foodId = (int)($requestedItem['foodId'] ?? 0);
            $quantity = (int)($requestedItem['quantity'] ?? 0);
            if ($foodId < 1 || $quantity < 1 || $quantity > 999) {
                throw new InvalidArgumentException('Enter a valid food item and quantity.');
            }
            $foodQuery->execute([$foodId]);
            $food = $foodQuery->fetch();
            if (!$food) {
                throw new InvalidArgumentException('A selected menu item is no longer available.');
            }
            $unitPrice = (float)$food['price'];
            $subtotal = round($unitPrice * $quantity, 2);
            $total += $subtotal;
            $items[] = ['food' => $food, 'quantity' => $quantity, 'subtotal' => $subtotal];
        }

        $insertOrder = $db->prepare(
            'INSERT INTO orders (customer_name, order_type, table_id, total_amount, status, order_date)
             VALUES (?, ?, ?, ?, "New", ?)'
        );
        $insertOrder->execute([$customer, $type, $tableId, round($total, 2), date('Y-m-d')]);
        $orderId = (int)$db->lastInsertId();
        $insertItem = $db->prepare(
            'INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity, subtotal)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        foreach ($items as $item) {
            $food = $item['food'];
            $insertItem->execute([$orderId, $food['id'], $food['name'], $food['price'], $item['quantity'], $item['subtotal']]);
        }
        if ($tableId !== null) {
            $updateTable = $db->prepare('UPDATE restaurant_tables SET status = "Occupied" WHERE id = ?');
            $updateTable->execute([$tableId]);
        }
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
}

function advanceOrder(PDO $db, array $input): void
{
    $id = (int)($input['id'] ?? 0);
    $db->beginTransaction();
    try {
        $query = $db->prepare('SELECT status, table_id FROM orders WHERE id = ? FOR UPDATE');
        $query->execute([$id]);
        $order = $query->fetch();
        if (!$order) {
            throw new InvalidArgumentException('Order not found.');
        }
        $nextStatus = ['New' => 'Preparing', 'Preparing' => 'Ready', 'Ready' => 'Completed'][$order['status']] ?? null;
        if ($nextStatus === null) {
            throw new InvalidArgumentException('This order is already completed.');
        }
        $update = $db->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $update->execute([$nextStatus, $id]);
        if ($nextStatus === 'Completed' && $order['table_id'] !== null) {
            $tableUpdate = $db->prepare('UPDATE restaurant_tables SET status = "Available" WHERE id = ?');
            $tableUpdate->execute([$order['table_id']]);
        }
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
}

function recordPayment(PDO $db, array $input): void
{
    $orderId = (int)($input['id'] ?? 0);
    $method = inputString($input, 'method', 20);
    $amountReceived = inputNumber($input, 'amountReceived', 0.01);
    $customerPhone = trim((string)($input['customerPhone'] ?? ''));
    $providerReference = trim((string)($input['momoCode'] ?? $input['providerReference'] ?? ''));
    if (!in_array($method, ['Cash', 'Mobile Money', 'Card'], true)) {
        throw new InvalidArgumentException('Choose a valid payment method.');
    }
    if ($method === 'Mobile Money') {
        if ($customerPhone === '' || !preg_match('/^\+?[0-9\s\-\(\)]{8,32}$/', $customerPhone)) {
            throw new InvalidArgumentException('Enter a valid customer phone number for Mobile Money.');
        }
        if ($providerReference === '') {
            throw new InvalidArgumentException('Add the Mobile Money code or reference number.');
        }
    }
    $db->beginTransaction();
    try {
        $query = $db->prepare(
            'SELECT o.total_amount, p.id AS payment_id FROM orders o
             LEFT JOIN payments p ON p.order_id = o.id WHERE o.id = ? FOR UPDATE'
        );
        $query->execute([$orderId]);
        $order = $query->fetch();
        if (!$order) {
            throw new InvalidArgumentException('Order not found.');
        }
        if ($order['payment_id'] !== null) {
            throw new InvalidArgumentException('This order has already been paid.');
        }
        $amount = (float)$order['total_amount'];
        if ($amountReceived < $amount) {
            throw new InvalidArgumentException('Payment must cover the full order total.');
        }
        $payment = $db->prepare(
            'INSERT INTO payments (order_id, amount, payment_method, customer_phone, provider_reference)
             VALUES (?, ?, ?, ?, ?)'
        );
        $payment->execute([
            $orderId,
            $amount,
            $method,
            $method === 'Mobile Money' ? $customerPhone : null,
            $method === 'Mobile Money' ? $providerReference : null,
        ]);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
}

function saveStaff(PDO $db, array $input): void
{
    $id = (int)($input['id'] ?? 0);
    $values = [
        inputString($input, 'name', 120),
        inputString($input, 'role', 40),
        inputString($input, 'phone', 40, false),
        inputNumber($input, 'salary'),
    ];
    if ($id > 0) {
        $statement = $db->prepare('UPDATE staff SET name = ?, role = ?, phone = ?, salary = ? WHERE id = ?');
        $statement->execute([...$values, $id]);
        if ($statement->rowCount() === 0) {
            $check = $db->prepare('SELECT 1 FROM staff WHERE id = ?');
            $check->execute([$id]);
            if (!$check->fetchColumn()) {
                throw new InvalidArgumentException('Staff member not found.');
            }
        }
        return;
    }
    $statement = $db->prepare('INSERT INTO staff (name, role, phone, salary) VALUES (?, ?, ?, ?)');
    $statement->execute($values);
}

function saveInventory(PDO $db, array $input): void
{
    $id = (int)($input['id'] ?? 0);
    $values = [
        inputString($input, 'name', 120),
        inputString($input, 'unit', 20),
        inputNumber($input, 'quantity'),
        inputNumber($input, 'minimum'),
        inputString($input, 'supplier', 120, false),
    ];
    if ($id > 0) {
        $statement = $db->prepare('UPDATE inventory SET name = ?, unit = ?, quantity = ?, minimum = ?, supplier = ? WHERE id = ?');
        $statement->execute([...$values, $id]);
        if ($statement->rowCount() === 0) {
            $check = $db->prepare('SELECT 1 FROM inventory WHERE id = ?');
            $check->execute([$id]);
            if (!$check->fetchColumn()) {
                throw new InvalidArgumentException('Ingredient not found.');
            }
        }
        return;
    }
    $statement = $db->prepare('INSERT INTO inventory (name, unit, quantity, minimum, supplier) VALUES (?, ?, ?, ?, ?)');
    $statement->execute($values);
}

function adjustStock(PDO $db, array $input): void
{
    $id = (int)($input['id'] ?? 0);
    $quantity = inputNumber($input, 'quantity', 0.01);
    $direction = inputString($input, 'direction', 3);
    if (!in_array($direction, ['in', 'out'], true)) {
        throw new InvalidArgumentException('Choose stock in or stock out.');
    }
    $db->beginTransaction();
    try {
        $query = $db->prepare('SELECT quantity FROM inventory WHERE id = ? FOR UPDATE');
        $query->execute([$id]);
        $current = $query->fetchColumn();
        if ($current === false) {
            throw new InvalidArgumentException('Ingredient not found.');
        }
        if ($direction === 'out' && $quantity > (float)$current) {
            throw new InvalidArgumentException('Stock out quantity cannot exceed current stock.');
        }
        $change = $direction === 'in' ? $quantity : -$quantity;
        $update = $db->prepare('UPDATE inventory SET quantity = quantity + ? WHERE id = ?');
        $update->execute([$change, $id]);
        $movement = $db->prepare('INSERT INTO stock_movements (inventory_id, direction, quantity) VALUES (?, ?, ?)');
        $movement->execute([$id, $direction, $quantity]);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
}

function createPurchase(PDO $db, array $input): void
{
    $inventoryId = (int)($input['inventoryId'] ?? 0);
    $quantity = inputNumber($input, 'quantity', 0.01);
    $supplier = inputString($input, 'supplier', 120, false);
    $db->beginTransaction();
    try {
        $query = $db->prepare('SELECT supplier FROM inventory WHERE id = ? FOR UPDATE');
        $query->execute([$inventoryId]);
        $existingSupplier = $query->fetchColumn();
        if ($existingSupplier === false) {
            throw new InvalidArgumentException('Ingredient not found.');
        }
        if ($supplier === '') {
            $supplier = (string)$existingSupplier;
        }
        $update = $db->prepare('UPDATE inventory SET quantity = quantity + ?, supplier = ? WHERE id = ?');
        $update->execute([$quantity, $supplier, $inventoryId]);
        $purchase = $db->prepare('INSERT INTO purchases (inventory_id, quantity, supplier, purchase_date) VALUES (?, ?, ?, ?)');
        $purchase->execute([$inventoryId, $quantity, $supplier, date('Y-m-d')]);
        $movement = $db->prepare('INSERT INTO stock_movements (inventory_id, direction, quantity, note) VALUES (?, "in", ?, "Purchase")');
        $movement->execute([$inventoryId, $quantity]);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        throw $error;
    }
}

requireLocalRequest();

try {
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

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $action = $_GET['action'] ?? '';
        if ($action === 'session') {
            $user = currentUser($db);
            respond([
                'authenticated' => $user !== null,
                'setupRequired' => (int)$db->query('SELECT COUNT(*) FROM auth_users')->fetchColumn() === 0,
                'csrfToken' => $_SESSION['csrf_token'] ?? null,
                'user' => $user,
            ]);
        }
        $user = requireUser($db);
        respond(['data' => responseData($db, $user), 'user' => $user]);
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Allow: GET, POST');
        respond(['error' => 'Method not allowed.'], 405);
    }

    requireSameOrigin();
    $contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
    if (str_starts_with($contentType, 'multipart/form-data')) {
        if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 5.5 * 1024 * 1024) {
            respond(['error' => 'Food photos must be 5 MB or smaller.'], 413);
        }
        $input = $_POST;
        if ($input === [] && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
            respond(['error' => 'The request exceeds the server upload limit. Choose a smaller food photo.'], 413);
        }
    } else {
        if (!str_starts_with($contentType, 'application/json')) {
            respond(['error' => 'Content-Type must be application/json or multipart/form-data.'], 415);
        }
        if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 1048576) {
            respond(['error' => 'Request body is too large.'], 413);
        }
        $input = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($input)) {
            throw new InvalidArgumentException('Invalid request body.');
        }
    }
    $action = $input['action'] ?? '';
    if ($action === 'login') {
        authenticate($db, $input);
    }

    $user = currentUser($db);
    if (!$user) {
        respond(['error' => 'Please sign in to continue.', 'code' => 'authentication_required'], 401);
    }
    requireCsrfToken();

    if ($action === 'change_password') {
        changePassword($db, $input, $user);
    }
    if ($action === 'logout') {
        writeAudit($db, $user['id'], 'logout');
        $_SESSION = [];
        session_regenerate_id(true);
        respond(['authenticated' => false]);
    }
    if ($user['mustChangePassword']) {
        respond(['error' => 'Change your temporary password before continuing.', 'code' => 'password_change_required'], 403);
    }

    $rolePermissions = [
        'save_food' => ['manager'],
        'upload_food_image' => ['manager'],
        'toggle_food' => ['manager'],
        'save_table' => ['manager', 'waiter'],
        'create_order' => ['manager', 'cashier', 'waiter'],
        'advance_order' => ['manager', 'chef'],
        'record_payment' => ['manager', 'cashier'],
        'save_staff' => ['manager'],
        'create_user' => ['manager'],
        'set_user_active' => ['manager'],
        'assign_delivery' => ['manager'],
        'update_delivery' => ['manager', 'driver'],
        'save_inventory' => ['manager'],
        'adjust_stock' => ['manager'],
        'create_purchase' => ['manager'],
    ];
    if (!isset($rolePermissions[$action])) {
        throw new InvalidArgumentException('Unknown operation.');
    }
    requireRole($user, $rolePermissions[$action]);

    if ($action === 'upload_food_image') {
        $image = uploadFoodImage($_FILES['image'] ?? []);
        writeAudit($db, $user['id'], $action);
        respond(['image' => $image]);
    }

    match ($action) {
        'save_food' => saveFood($db, $input),
        'toggle_food' => (function () use ($db, $input): void {
            $statement = $db->prepare('UPDATE foods SET active = NOT active WHERE id = ?');
            $statement->execute([(int)($input['id'] ?? 0)]);
            if ($statement->rowCount() !== 1) {
                throw new InvalidArgumentException('Food item not found.');
            }
        })(),
        'save_table' => saveTable($db, $input),
        'create_order' => createOrder($db, $input),
        'advance_order' => advanceOrder($db, $input),
        'record_payment' => recordPayment($db, $input),
        'save_staff' => saveStaff($db, $input),
        'create_user' => createUser($db, $input, $user),
        'set_user_active' => setUserActive($db, $input, $user),
        'assign_delivery' => assignDelivery($db, $input, $user),
        'update_delivery' => updateDelivery($db, $input, $user),
        'save_inventory' => saveInventory($db, $input),
        'adjust_stock' => adjustStock($db, $input),
        'create_purchase' => createPurchase($db, $input),
        default => throw new InvalidArgumentException('Unknown operation.'),
    };

    writeAudit($db, $user['id'], $action);
    respond(['data' => responseData($db, $user), 'user' => $user]);
} catch (InvalidArgumentException $error) {
    respond(['error' => $error->getMessage()], 422);
} catch (JsonException) {
    respond(['error' => 'Request body must be valid JSON.'], 400);
} catch (PDOException $error) {
    error_log('Restaurant database error: ' . $error->getMessage());
    if ((string)$error->getCode() === '23000') {
        respond(['error' => 'That record conflicts with existing data. Check table numbers and linked records.'], 409);
    }
    respond(['error' => 'The database request failed. Check that the database is installed and configured.'], 500);
} catch (Throwable $error) {
    error_log('Restaurant API error: ' . $error->getMessage());
    respond(['error' => 'The server could not complete this request.'], 500);
}
