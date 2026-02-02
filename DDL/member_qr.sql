CREATE TABLE member_qr (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  qr_token VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_member_qr_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_member_qr_user ON member_qr(user_id);