import pool from '../config/db.js'
import bcrypt from 'bcrypt';

// @desc     Auth User and Set Token
// @route    POST /api/users/auth
// @access   Public
const authUser = async (req, res) => {
    try {
        res.status(201).json({ message: 'Auth user' });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// @desc     Register a new user
// @route    POST /api/users
// @access   Public
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email',
            [username, email, hashedPassword] 
        );

        const user = result.rows[0]; // Get the user data

        res.status(201).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        });

    } catch (error) {
        console.error('Register error:', error);
        next(error);
    }
}

// @desc     Logout user
// @route    POST /api/users/logout
// @access   Public
const logoutUser = async (req, res) => {
    try {
        res.status(201).json({ message: 'Logged out user' });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// @desc     Get user profile
// @route    GET /api/users/profile
// @access   Private
const getUser = async (req, res) => {
    try {
        res.status(201).json({ message: 'User Profile' });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

// @desc     Update user profile
// @route    PUT /api/users/profile
// @access   Private
const updateUserProfile = async (req, res) => {
    try {
        res.status(201).json({ message: 'Update user profile' });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export { 
    authUser,
    registerUser,
    logoutUser,
    getUser,
    updateUserProfile
};