-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255),
    gateway VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending',
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_name VARCHAR(255),
    metadata JSONB,
    gateway_response JSONB,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    payment_url VARCHAR(500),
    return_url VARCHAR(500),
    refunded_amount DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_idempotency_key ON transactions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_transactions_external_id_gateway ON transactions(external_id, gateway);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Create webhook_events table
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway VARCHAR(50) NOT NULL,
    event_id VARCHAR(512) NOT NULL,
    event_type VARCHAR(255),
    normalized_event_key VARCHAR(512),
    payload JSONB NOT NULL,
    raw_body TEXT,
    headers JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    signature_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    signature_valid BOOLEAN,
    duplicate_of_event_id VARCHAR(512),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processing_started_at TIMESTAMP,
    first_processed_at TIMESTAMP,
    processed_at TIMESTAMP,
    retry_count INTEGER DEFAULT 0,
    next_retry_at TIMESTAMP,
    error_message TEXT,
    replay_count INTEGER DEFAULT 0,
    last_replay_at TIMESTAMP,
    last_replay_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(gateway, event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_normalized_event_key ON webhook_events(normalized_event_key);
CREATE INDEX IF NOT EXISTS idx_webhook_events_next_retry_at ON webhook_events(next_retry_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at);

-- Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id),
    external_refund_id VARCHAR(255),
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    reason TEXT,
    metadata JSONB,
    gateway_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refunds_transaction_id ON refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_refunds_external_refund_id ON refunds(external_refund_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    transaction_id UUID REFERENCES transactions(id),
    refund_id UUID REFERENCES refunds(id),
    webhook_event_id UUID REFERENCES webhook_events(id),
    gateway VARCHAR(50),
    previous_status VARCHAR(100),
    next_status VARCHAR(100),
    source VARCHAR(100) NOT NULL DEFAULT 'system',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_transaction_id ON audit_logs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_refund_id ON audit_logs(refund_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_webhook_event_id ON audit_logs(webhook_event_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Create analytics_daily table
CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    gateway VARCHAR(50),
    total_transactions INTEGER DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    total_refunds DECIMAL(15, 2) DEFAULT 0,
    net_amount DECIMAL(15, 2) DEFAULT 0,
    failed_transactions INTEGER DEFAULT 0,
    pending_transactions INTEGER DEFAULT 0,
    UNIQUE(date, gateway)
);

CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);
