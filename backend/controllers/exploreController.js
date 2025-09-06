import pool from '../config/db.js';

// @desc     Get all NYT best seller lists available
// @route    GET /api/explore/lists
// @access   Public
const getAvailableLists = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT DISTINCT list_name, list_name_encoded FROM explore_books ORDER BY list_name'
        );
        
        res.json({
            success: true,
            lists: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// @desc     Get all NYT books grouped by list
// @route    GET /api/explore/all
// @access   Public
const getAllBooks = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT * FROM explore_books 
             WHERE google_books_id IS NOT NULL
             ORDER BY list_name, rank ASC`
        );
        
        // Group books by list_name
        const booksByList = result.rows.reduce((groupedLists, book) => {
            if (!groupedLists[book.list_name]) {
                // If this list doesn't exist yet
                groupedLists[book.list_name] = {
                    listName: book.list_name,
                    listNameEncoded: book.list_name_encoded,
                    books: []
                };
            }
            groupedLists[book.list_name].books.push(book);
            return groupedLists;
        }, {});
        
        res.json({
            success: true,
            lists: Object.values(booksByList)
        });
    } catch (error) {
        next(error);
    }
};


// @desc     Get books from a specific NYT list (with Google Books IDs)
// @route    GET /api/explore/list/:listName
// @access   Public
const getBooksByList = async (req, res, next) => {
    try {
        const { listName } = req.params;
        
        const result = await pool.query(
            'SELECT * FROM explore_books WHERE list_name_encoded = $1 ORDER BY rank',
            [listName]
        );
        
        res.json({
            success: true,
            listName: listName,
            books: result.rows
        });
    } catch (error) {
        next(error);
    }
};

// @desc     Get popular books (top 20 across all lists) with Google Books IDs
// @route    GET /api/explore/popular
// @access   Public
const getPopularBooks = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT ON (title, author) * FROM explore_books 
             WHERE rank <= 7 AND google_books_id IS NOT NULL
             AND list_name NOT ILIKE '%picture%'
             ORDER BY title, author, rank ASC, list_name 
             LIMIT 40`
        );
        
        res.json({
            success: true,
            books: result.rows
        });
    } catch (error) {
        next(error);
    }
};

export { 
    getAvailableLists, 
    getAllBooks,
    getBooksByList, 
    getPopularBooks 
};
