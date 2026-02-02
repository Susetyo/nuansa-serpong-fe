CREATE TABLE point_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rupiah_value NUMERIC(15,2) NOT NULL,
  point_value INT NOT NULL,
  rounding rounding_type NOT NULL DEFAULT 'FLOOR',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_point_rules_admin
    FOREIGN KEY (created_by)
    REFERENCES users(id)
);

CREATE INDEX idx_point_rules_active ON point_rules(is_active);