import express from 'express';
const router = express.Router();
import { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserPassword
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);

router.route('/profile')
.get(protect, getUserProfile)
.put(protect, updateUserProfile);

router.put('/password', protect, updateUserPassword);



export default router;