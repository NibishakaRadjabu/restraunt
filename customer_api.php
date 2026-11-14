<?php
declare(strict_types=1);
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
                p.payment_method AS paymentMethod
         FROM orders o
         JOIN deliveries d ON d.order_id = o.id
         LEFT JOIN payments p ON p.order_id = o.id
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
        $order['items'] = $items[$order['id']] ?? [];
    }
    unset($order);
    return $orders;
}

function placeCustomerOrder(PDO $db, array $input, array $customer): void
{
    $address = trim((string)($input['address'] ?? ''));
    $notes = trim((string)($input['notes'] ?? ''));
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

    $existingQuery = $db->prepare(
        'SELECT id FROM orders WHERE customer_id = ? AND customer_idempotency_key = ?'
    );
    $existingQuery->execute([$customer['id'], $idempotencyKey]);
    $existingOrderId = $existingQuery->fetchColumn();
    if ($existingOrderId !== false) {
        customerRespond(['orderId' => (int)$existingOrderId]);
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
        $insertOrder = $db->prepare(
            'INSERT INTO orders
             (customer_name, order_type, table_id, total_amount, status, order_date, customer_id,
              customer_phone, delivery_address, delivery_notes, customer_idempotency_key)
             VALUES (?, "Delivery", NULL, ?, "New", ?, ?, ?, ?, ?, ?)'
        );
        $insertOrder->execute([
            $customer['name'],
            number_format($totalUsd, 2, '.', ''),
            date('Y-m-d'),
            $customer['id'],
            $customer['phone'],
            $address,
            $notes,
            $idempotencyKey,
        ]);
        $orderId = (int)$db->lastInsertId();
        $insertItem = $db->prepare(
            'INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity, subtotal)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        foreach ($orderItems as $item) {
            $insertItem->execute([
                $orderId,
                $item['foodId'],
                $item['name'],
                number_format($item['price'], 2, '.', ''),
                $item['quantity'],
                number_format($item['subtotal'], 2, '.', ''),
            ]);
        }
        $db->prepare('INSERT INTO deliveries (order_id, status) VALUES (?, "Pending")')->execute([$orderId]);
        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        if ($error instanceof PDOException && (string)$error->getCode() === '23000') {
            $existingQuery->execute([$customer['id'], $idempotencyKey]);
            $existingOrderId = $existingQuery->fetchColumn();
            if ($existingOrderId !== false) {
                customerRespond(['orderId' => (int)$existingOrderId]);
            }
        }
        throw $error;
    }

    customerRespond(['orderId' => $orderId], 201);
}

requireCustomerLocalRequest();
try {
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
            customerRespond(['foods' => $foods, 'csrfToken' => $_SESSION['csrf_token']]);
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
    if ($action === 'place_order') {
        placeCustomerOrder($db, $input, $customer);
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
} catch (Throwable $error) {
    error_log('Customer ordering error: ' . $error->getMessage());
    customerRespond(['error' => 'The customer service could not complete this request.'], 500);
}
