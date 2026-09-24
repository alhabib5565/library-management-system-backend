-- Active: 1760457924579@@127.0.0.1@5432@library_management@public

CREATE TABLE IF NOT EXISTS books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    image TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (
        status IN ('active', 'inactive')
    ),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_books_created_by FOREIGN KEY (created_by) REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);