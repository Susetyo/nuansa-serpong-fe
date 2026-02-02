CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'MEMBER',
  status user_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);