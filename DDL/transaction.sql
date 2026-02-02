CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  receptionist_id UUID NOT NULL,
  transaction_amount NUMERIC(15,2) NOT NULL,
  point_earned INT NOT NULL,
  rule_id UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id)
    REFERENCES users(id),

  CONSTRAINT fk_transactions_receptionist
    FOREIGN KEY (receptionist_id)
    REFERENCES users(id),

  CONSTRAINT fk_transactions_rule
    FOREIGN KEY (rule_id)
    REFERENCES point_rules(id)
);

CREATE INDEX idx_transactions_user ON transactions(user_id);