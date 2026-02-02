CREATE TABLE redeem_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  redeem_point INT NOT NULL,
  redeem_value NUMERIC(15,2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_redeem_transactions_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
);

CREATE INDEX idx_redeem_user ON redeem_transactions(user_id);