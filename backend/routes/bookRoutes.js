import express from 'express';
const router = express.Router();
import { 
    getAllBooks, 
    getFilteredBooks,
    getBook, 
    addBook, 
    updateBookStatus, 
    toggleBookFavorite, 
    deleteBook } from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';


//GET routes
router.get('/', protect, getAllBooks);
router.get('/details/:googleBookId', protect, getBook); 
router.get('/:status', protect, getFilteredBooks);

//POST routes
router.post('/', protect, addBook);

//PUT routes
router.put('/:bookId/status', protect, updateBookStatus);
router.put('/:bookId/favorite', protect, toggleBookFavorite);

//DELETE routes
router.delete('/:bookId', protect, deleteBook);





export default router;