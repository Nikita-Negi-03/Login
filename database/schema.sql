CREATE TABLE users (
  id SERIAL PRIMARY KEY,                     -- Auto-incrementing integer unique identifier
  username VARCHAR(255) UNIQUE NOT NULL,    -- Unique username with a maximum length of 255 characters
  password_hash VARCHAR(255) NOT NULL,      -- Password hash with a maximum length of 255 characters
  login_attempts INT DEFAULT 0,              -- Integer to track login attempts, default value 0
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of record creation
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of last update
  blocked_until TIMESTAMP NULL
);