CREATE DATABASE readinglist;

CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE book (
    book_id SERIAL PRIMARY KEY,
    google_books_id VARCHAR(50), 
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    description TEXT,
    cover_image VARCHAR(255),
    favorite BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) CHECK (status IN ('want_to_read', 'currently_reading', 'completed')) DEFAULT 'want_to_read',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES "user"(user_id) ON DELETE CASCADE NOT NULL
);