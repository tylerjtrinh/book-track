import express from 'express';
const router = express.Router();
import { 
    getAllBooks, 
    getBook, 
    addBook, 
    updateBookStatus, 
    toggleBookFavorite, 
    updateBookRating,
    deleteBook
 } from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';


//GET routes
router.get('/', protect, getAllBooks);
router.get('/details/:googleBookId', protect, getBook); 

//POST routes
router.post('/', protect, addBook);

//PUT routes
router.put('/status/:bookId', protect, updateBookStatus);
router.put('/favorite/:bookId', protect, toggleBookFavorite);
router.put('/rating/:bookId', protect, updateBookRating);

//DELETE routes
router.delete('/:bookId', protect, deleteBook);





export default router;