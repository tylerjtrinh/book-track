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
            `SELECT * FROM explore_books 
             WHERE rank <= 5 AND google_books_id IS NOT NULL
             AND list_name NOT ILIKE '%children%' 
             AND list_name NOT ILIKE '%picture%'
             AND list_name NOT ILIKE '%middle grade%'
             ORDER BY list_name, rank 
             LIMIT 20`
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
    getBooksByList, 
    getPopularBooks 
};
