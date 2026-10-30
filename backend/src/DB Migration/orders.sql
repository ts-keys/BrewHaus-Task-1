
CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id TEXT NOT NULL
        REFERENCES "user"(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'paid',
            'failed',
            'cancelled',
            'refunded'
        )),

    total_cents INTEGER NOT NULL
        CHECK (total_cents > 0),

    currency CHAR(3) NOT NULL DEFAULT 'ZAR',

    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

CREATE TABLE order_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    order_id BIGINT NOT NULL
        REFERENCES orders(id) ON DELETE CASCADE,

    book_id INTEGER NOT NULL
        REFERENCES books(id) ON DELETE RESTRICT,

    book_title VARCHAR(255) NOT NULL,

    quantity INTEGER NOT NULL
        CHECK (quantity > 0),

    unit_price_cents INTEGER NOT NULL
        CHECK (unit_price_cents > 0),

    line_total_cents INTEGER GENERATED ALWAYS AS
        (quantity * unit_price_cents) STORED
);

CREATE INDEX idx_orders_user_id
    ON orders(user_id);

CREATE INDEX idx_orders_status
    ON orders(status);

CREATE INDEX idx_order_items_order_id
    ON order_items(order_id);
