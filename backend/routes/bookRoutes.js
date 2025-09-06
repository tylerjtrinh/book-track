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
router.put('/status/:googleBookId', protect, updateBookStatus);
router.put('/favorite/:googleBookId', protect, toggleBookFavorite);
router.put('/rating/:googleBookId', protect, updateBookRating);

//DELETE routes
router.delete('/:googleBookId', protect, deleteBook);





export default router;