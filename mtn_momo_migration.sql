USE harbor_hearth_restaurant;

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

ALTER TABLE momo_payment_transactions
  ADD COLUMN provider_amount_rwf BIGINT UNSIGNED NULL AFTER provider_status,
  ADD COLUMN provider_currency CHAR(3) NULL AFTER provider_amount_rwf;
