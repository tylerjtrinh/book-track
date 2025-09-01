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
router.get('/:status', protect, getFilteredBooks);
router.get('/googleBookId', protect, getBook);

//POST routes
router.post('/', protect, addBook);

//PUT routes
router.put('/:id/status', protect, updateBookStatus);
router.put('/:id/favorite', toggleBookFavorite);

//DELETE routes
router.delete('/:id', protect, deleteBook);





export default router;