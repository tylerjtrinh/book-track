import pool from '../config/db.js';

const formatBookResponse = (dbBook) => ({
    book_id: dbBook.book_id,
    google_books_id: dbBook.google_books_id,
    title: dbBook.title,
    author: dbBook.author,
    description: dbBook.description,
    cover_image: dbBook.cover_image,
    genres: dbBook.genres || [],
    status: dbBook.status,
    favorite: dbBook.favorite,
    user_rating: dbBook.user_rating,
});

const formatGoogleBookResponse = (googleBook) => ({
    google_books_id: googleBook.id,
    title: googleBook.volumeInfo?.title || 'Unknown Title',
    author: googleBook.volumeInfo?.authors ? googleBook.volumeInfo.authors.join(', ') : 'Unknown Author',
    published_date: googleBook.volumeInfo?.publishedDate || 'No published date available',
    description: googleBook.volumeInfo?.description || 'No description available',
    cover_image: googleBook.volumeInfo?.imageLinks?.thumbnail || null,
    genres: googleBook.volumeInfo?.categories || []
});

const checkBookExists = async (googleBookId, userId) => {
    const result = await pool.query(
        'SELECT * FROM book WHERE google_books_id = $1 AND user_id = $2',
        [googleBookId, userId]
    );
    return result.rows[0] || null;
};

export { formatBookResponse, formatGoogleBookResponse, checkBookExists };