import express from 'express';
import { 
    getAvailableLists, 
    getAllBooks,
    getBooksByList, 
    getPopularBooks 
} from '../controllers/exploreController.js';

const router = express.Router();

// Get all available NYT lists
router.get('/lists', getAvailableLists);

// Get all books grouped by list
router.get('/all', getAllBooks);

// Get books from a specific list (e.g., /api/explore/list/trade-fiction-paperback)
router.get('/list/:listName', getBooksByList);

// Get popular books across all lists
router.get('/popular', getPopularBooks);

export default router;
