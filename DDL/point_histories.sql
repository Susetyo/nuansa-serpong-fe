CREATE TABLE point_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  transaction_id UUID NOT NULL,
  point_amount INT NOT NULL,
  point_used INT NOT NULL DEFAULT 0,
  point_remaining INT NOT NULL,
  earned_at TIMESTAMP NOT NULL,
  expired_at TIMESTAMP NOT NULL,
  status point_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_point_histories_user
    FOREIGN KEY (user_id)
    REFERENCES users(id),

  CONSTRAINT fk_point_histories_transaction
    FOREIGN KEY (transaction_id)
    REFERENCES transactions(id)
);

CREATE INDEX idx_point_histories_user ON point_histories(user_id);
CREATE INDEX idx_point_histories_expired ON point_histories(expired_at);