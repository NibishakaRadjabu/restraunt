ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_idempotency_key CHAR(36) NULL,
  ADD UNIQUE KEY IF NOT EXISTS uq_orders_customer_idempotency (customer_id, customer_idempotency_key);
