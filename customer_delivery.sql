USE harbor_hearth_restaurant;

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

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_id BIGINT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(32) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS delivery_address VARCHAR(500) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS delivery_notes VARCHAR(1000) NOT NULL DEFAULT '';

ALTER TABLE orders
  ADD KEY IF NOT EXISTS idx_orders_customer (customer_id, id),
  ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE SET NULL;

ALTER TABLE auth_users
  MODIFY role ENUM('manager', 'cashier', 'chef', 'waiter', 'driver') NOT NULL;

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
