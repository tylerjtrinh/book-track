import express from 'express';
const router = express.Router();
import { 
    authUser,
    registerUser,
    logoutUser,
    getUser,
    updateUserProfile 
} from '../controllers/userController.js'

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);

router.route('/profile').get(getUser).put(updateUserProfile);



export default router;