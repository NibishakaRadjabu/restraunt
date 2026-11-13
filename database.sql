CREATE DATABASE IF NOT EXISTS harbor_hearth_restaurant
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE harbor_hearth_restaurant;

CREATE TABLE IF NOT EXISTS foods (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(40) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_foods_category_active (category, active)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS restaurant_tables (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  table_number VARCHAR(20) NOT NULL,
  seats SMALLINT UNSIGNED NOT NULL,
  status ENUM('Available', 'Occupied', 'Reserved') NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_restaurant_tables_number (table_number)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customers_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_name VARCHAR(120) NOT NULL,
  order_type ENUM('Dine-in', 'Takeaway', 'Delivery') NOT NULL,
  table_id INT UNSIGNED NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('New', 'Preparing', 'Ready', 'Completed') NOT NULL DEFAULT 'New',
  order_date DATE NOT NULL,
  customer_id BIGINT UNSIGNED NULL,
  customer_phone VARCHAR(32) NOT NULL DEFAULT '',
  delivery_address VARCHAR(500) NOT NULL DEFAULT '',
  delivery_notes VARCHAR(1000) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_orders_date_status (order_date, status),
  KEY idx_orders_table_status (table_id, status),
  KEY idx_orders_customer (customer_id, id),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL,
  CONSTRAINT fk_orders_table FOREIGN KEY (table_id) REFERENCES restaurant_tables (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  food_id INT UNSIGNED NULL,
  food_name VARCHAR(120) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_food FOREIGN KEY (food_id) REFERENCES foods (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('Cash', 'Mobile Money', 'Card') NOT NULL,
  customer_phone VARCHAR(32) NULL,
  provider_reference VARCHAR(120) NULL,
  payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_order (order_id),
  KEY idx_payments_date (payment_date),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS momo_payment_transactions (
  payment_id CHAR(36) NOT NULL,
  reference_id CHAR(36) NOT NULL,
  idempotency_key CHAR(36) NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NULL,
  customer_phone VARCHAR(32) NOT NULL,
  amount_usd DECIMAL(10, 2) NOT NULL,
  amount_rwf BIGINT UNSIGNED NOT NULL,
  exchange_rate DECIMAL(12, 4) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'RWF',
  status ENUM('INITIATING', 'PENDING', 'SUCCESSFUL', 'FAILED', 'REVIEW') NOT NULL DEFAULT 'INITIATING',
  provider_status VARCHAR(32) NOT NULL DEFAULT '',
  provider_amount_rwf BIGINT UNSIGNED NULL,
  provider_currency CHAR(3) NULL,
  provider_transaction_id VARCHAR(120) NOT NULL DEFAULT '',
  items_json LONGTEXT NOT NULL,
  delivery_address VARCHAR(500) NOT NULL,
  delivery_notes VARCHAR(1000) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (payment_id),
  UNIQUE KEY uq_momo_reference (reference_id),
  UNIQUE KEY uq_momo_customer_idempotency (customer_id, idempotency_key),
  UNIQUE KEY uq_momo_order (order_id),
  KEY idx_momo_status_created (status, created_at),
  CONSTRAINT fk_momo_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
  CONSTRAINT fk_momo_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS staff (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(40) NOT NULL,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auth_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('manager', 'cashier', 'chef', 'waiter', 'driver') NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  must_change_password TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_auth_users_username (username),
  KEY idx_auth_users_active_role (active, role)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_favorites (
  customer_id BIGINT UNSIGNED NOT NULL,
  food_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (customer_id, food_id),
  CONSTRAINT fk_customer_favorites_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
  CONSTRAINT fk_customer_favorites_food FOREIGN KEY (food_id) REFERENCES foods (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_login_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  phone_key CHAR(64) NOT NULL,
  attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_customer_attempts_phone_time (phone_key, attempted_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS deliveries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  driver_user_id INT UNSIGNED NULL,
  status ENUM('Pending', 'Assigned', 'Accepted', 'Picked up', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
  assigned_at DATETIME NULL,
  accepted_at DATETIME NULL,
  picked_up_at DATETIME NULL,
  delivered_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_deliveries_order (order_id),
  KEY idx_deliveries_driver_status (driver_user_id, status),
  CONSTRAINT fk_deliveries_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_deliveries_driver FOREIGN KEY (driver_user_id) REFERENCES auth_users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS auth_login_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username_key CHAR(64) NOT NULL,
  attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_auth_attempts_username_time (username_key, attempted_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id INT UNSIGNED NULL,
  event VARCHAR(80) NOT NULL,
  details VARCHAR(500) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_logs_created (created_at),
  KEY idx_audit_logs_actor (actor_user_id, created_at),
  CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_user_id) REFERENCES auth_users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
  minimum DECIMAL(10, 2) NOT NULL DEFAULT 0,
  supplier VARCHAR(120) NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_inventory_low_stock (quantity, minimum)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stock_movements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  inventory_id INT UNSIGNED NOT NULL,
  direction ENUM('in', 'out') NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  note VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stock_movements_inventory (inventory_id, created_at),
  CONSTRAINT fk_stock_movements_inventory FOREIGN KEY (inventory_id) REFERENCES inventory (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS purchases (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  inventory_id INT UNSIGNED NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  supplier VARCHAR(120) NOT NULL DEFAULT '',
  purchase_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_purchases_date (purchase_date),
  CONSTRAINT fk_purchases_inventory FOREIGN KEY (inventory_id) REFERENCES inventory (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO foods (id, name, category, price, image, description, active) VALUES
  (1, 'Herb-roasted chicken', 'Dinner', 18.50, '🍗', 'Free-range chicken, garden herbs, seasonal vegetables', 1),
  (2, 'Wild mushroom risotto', 'Dinner', 16.00, '🍄', 'Arborio rice, wild mushrooms, parmesan', 1),
  (3, 'Avocado toast', 'Breakfast', 11.50, '🥑', 'Sourdough, smashed avocado, chili flakes', 1),
  (4, 'Seared salmon bowl', 'Lunch', 17.50, '🐟', 'Atlantic salmon, rice, greens, citrus dressing', 1),
  (5, 'Garden lemonade', 'Drinks', 5.00, '🍋', 'Fresh lemon, mint, a little honey', 1),
  (6, 'Chocolate fondant', 'Dessert', 9.00, '🍰', 'Warm dark chocolate cake, vanilla cream', 1)
ON DUPLICATE KEY UPDATE id = VALUES(id);

INSERT INTO restaurant_tables (id, table_number, seats, status) VALUES
  (1, '01', 2, 'Available'), (2, '02', 2, 'Available'),
  (3, '03', 4, 'Available'), (4, '04', 4, 'Available'),
  (5, '05', 4, 'Available'), (6, '06', 6, 'Available'),
  (7, '07', 2, 'Available'), (8, '08', 6, 'Available')
ON DUPLICATE KEY UPDATE id = VALUES(id);
