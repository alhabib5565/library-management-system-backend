-- Active: 1760457924579@@127.0.0.1@5432@library_management@public
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Librarian' CHECK (
        role IN ('Librarian', 'Admin')
    ),
    status VARCHAR(50) DEFAULT 'active' CHECK (
        status IN ('active', 'inactive')
    ),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- ALTER TABLE users ADD COLUMN reset_password_token TEXT;

-- ALTER TABLE users ADD COLUMN reset_password_expires TIMESTAMP;

-- CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- CREATE DATABASE library_management