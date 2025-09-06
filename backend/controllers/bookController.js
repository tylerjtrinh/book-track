import pool from '../config/db.js';
import { formatBookResponse, checkBookExists } from '../utils/bookUtils.js';

// @desc     Get all books in users database
// @route    GET /api/books
// @access   Private
const getAllBooks = async (req, res, next) => {
    try {
        const userId = req.user.user_id; // From JWT (guaranteed by protect middleware)

        //GET all books from users reading list
        const result = await pool.query(
            'SELECT * FROM book WHERE user_id = $1 ORDER BY created_at ASC',
            [userId]
        );

        const formattedBooks = result.rows.map(formatBookResponse);

        res.json({
            books: formattedBooks,
            count: formattedBooks.length
        });

    } catch (error) {
        next(error);
    }
};

// @desc     Get data from one book. Book Details
//           First check if the book is in the users book table. 
//           Returns different responses based on book status.
//           Does NOT fetch from Google Books API to preserve server quota.
// @route    GET /api/books/details/:googleBookId
// @access   Private
const getBook = async (req, res, next) => {
    try {
        const userId = req.user.user_id; //FROM JWT
        const { googleBookId } = req.params;
        
        // Check if book is already in user's reading list
        const result = await pool.query(
            'SELECT * FROM book WHERE google_books_id = $1 AND user_id = $2',
            [googleBookId, userId]
        );

        if (result.rows.length > 0) {
            // User is logged in and book is in their table
            const dbBook = result.rows[0];
            const bookData = formatBookResponse(dbBook);
            
            res.status(200).json({
                isInUserList: true,
                ...bookData
            });
        } else {
            // User is logged in but book is not in their table
            res.status(200).json({
                isInUserList: false,
                googleBooksId: googleBookId,
                message: 'Book not in your reading list. Frontend should fetch from Google Books API.'
            });
        }
    } catch (error) {
        //User is not logged in
        next(error);
    }
};

// @desc     Add book to database. Add to book table. Book data sent from the front end
// @route    POST /api/books
// @access   Private
const addBook = async (req, res, next) => {
    try {
        const userId = req.user.user_id; // From JWT
        console.log('Received request body:', req.body); // Debug log
        
        const { 
            google_books_id,                           
            title, 
            author, 
            description, 
            cover_image,
            genres 
        } = req.body; // Book data from frontend

        console.log('Extracted fields:', { google_books_id, title, author, description, cover_image, genres }); // Debug log

        // Check if book already exists in user's list
        const existingBook = await checkBookExists(google_books_id, userId);

        if (existingBook) {
            return res.status(400).json({ message: 'Book is already in your reading list' });
        }

        // Ensure genres is properly formatted for JSONB
        const formattedGenres = genres ? JSON.stringify(genres) : null;

        //Add book to database
        const result = await pool.query(
            `INSERT INTO book (google_books_id, title, author, description, cover_image, genres, user_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
            [google_books_id, title, author, description, cover_image, formattedGenres, userId]
        );
        
        const book = result.rows[0];
        const bookData = formatBookResponse(book);
        
        res.status(201).json({
            message: 'Book added successfully',
            book: {
                ...bookData,
                isInUserList: true
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc     Edit book status. Ex: want_to_read, currently_reading, completed
// @route    PUT /api/books/status/:googleBookId/
// @access   Private
const updateBookStatus = async (req, res, next) => {
    try {
        const userId = req.user.user_id; // From JWT 
        const { googleBookId } = req.params; 
        const { status } = req.body; // new status from request body

        // Update the book status and return the updated book
        const result = await pool.query(
            'UPDATE book SET status = $1 WHERE google_books_id = $2 AND user_id = $3 RETURNING *',
            [status, googleBookId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found in your reading list' });
        }

        const updatedBook = result.rows[0];
        const bookData = formatBookResponse(updatedBook);

        res.json({
            message: 'Book status updated successfully',
            book: bookData
        });

    } catch (error) {
        next(error);
    }
};

// @desc     Add or remove books from favorites
// @route    PUT /api/books/favorite/:googleBookId
// @access   Private
const toggleBookFavorite = async (req, res, next) => {
    try {
        const userId = req.user.user_id; // From JWT 
        const { googleBookId } = req.params; // book ID from URL 

        // First get the current favorite status
        const currentResult = await pool.query(
            'SELECT favorite FROM book WHERE google_books_id = $1 AND user_id = $2',
            [googleBookId, userId]
        );

        if (currentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found in your reading list' });
        }

        // Toggle the favorite status
        const currentFavorite = currentResult.rows[0].favorite;
        const newFavorite = !currentFavorite;

        // Update the favorite status and return the updated book
        const result = await pool.query(
            'UPDATE book SET favorite = $1 WHERE google_books_id = $2 AND user_id = $3 RETURNING *',
            [newFavorite, googleBookId, userId]
        );

        const updatedBook = result.rows[0];
        const bookData = formatBookResponse(updatedBook);

        res.json({
            message: `Book ${newFavorite ? 'added to' : 'removed from'} favorites`,
            book: bookData
        });

    } catch (error) {
        next(error);
    }
};

// @desc     Update book rating
// @route    PUT /api/books/rating/:googleBookId
// @access   Private
const updateBookRating = async (req, res, next) => {
    try {
        const userId = req.user.user_id; // From JWT 
        const { googleBookId } = req.params; // book ID from URL
        const { user_rating } = req.body; // rating from request body

        // Validate rating is between 1-5
        if (user_rating && (user_rating < 1 || user_rating > 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Update the book rating and return the updated book
        const result = await pool.query(
            'UPDATE book SET user_rating = $1 WHERE google_books_id = $2 AND user_id = $3 RETURNING *',
            [user_rating, googleBookId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found in your reading list' });
        }

        const updatedBook = result.rows[0];
        const bookData = formatBookResponse(updatedBook);

        res.json({
            message: 'Book rating updated successfully',
            book: bookData
        });

    } catch (error) {
        next(error);
    }
};

// @desc     Delete book from user's reading list
// @route    DELETE /api/books/:googleBookId
// @access   Private
const deleteBook = async (req, res, next) => {
    try {
        const userId = req.user.user_id; // From JWT 
        const { googleBookId } = req.params;

        // DELETE book from users reading list
        const result = await pool.query(
            'DELETE FROM book WHERE google_books_id = $1 AND user_id = $2 RETURNING *',
            [googleBookId, userId]
        );

        if (result.rows.length === 0) {
            // Book didn't exist - return 404 and stop here
            return res.status(404).json({ message: 'Book not found' });
        }
        //Only continue here if book was actually deleted

        // Get updated book list for reading list page
        const updatedBookListResult = await pool.query(
            'SELECT * FROM book WHERE user_id = $1 ORDER BY created_at ASC',
            [userId]
        );
        
        const updatedBookList = updatedBookListResult.rows.map(formatBookResponse);

        // Response works for both scenarios:
        // - Reading list page: uses 'books' array to update the list
        // - Book detail page: uses 'isInUserList: false' to update status
        res.status(200).json({
            message: 'Book removed from reading list',
            isInUserList: false,
            books: updatedBookList,
            count: updatedBookList.length
        });

    } catch (error) {
        next(error);
    }
};

export { 
    getAllBooks, 
    getBook, 
    addBook, 
    updateBookStatus, 
    toggleBookFavorite, 
    updateBookRating,
    deleteBook
};
