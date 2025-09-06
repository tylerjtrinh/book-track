import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

// @desc     Auth User and Set Token
// @route    POST /api/users/auth
// @access   Public
const authUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const trimmedUsername = username?.trim();
        const result = await pool.query(
            'SELECT * FROM "user" WHERE username = $1',
            [trimmedUsername]
        );

        //Check if user exists
        if(result.rows.length === 0) {
            //User does not exist
            const error = new Error('Invalid username or password');
            error.statusCode = 401;
            return next(error);
        }
            
        //User does exist
        const user = result.rows[0]; //Get the user data
        const hashedPassword = user.password;

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if(!isMatch) {
            //Invalid Password
            const error = new Error('Invalid username or password');
            error.statusCode = 401;
            return next(error);
        }

        //Continue here if isMatch === true
        generateToken(res, user.user_id);
        res.status(201).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        console.error('Auth error:', error);
        next(error);
    }
};

// @desc     Register a new user
// @route    POST /api/users
// @access   Public
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        //Username Validation
        if (!username || username.trim() === '') {
            return res.status(400).json({ error: 'Username is required' });
        }
        const trimmedUsername = username.trim();

        //Email Validation
        if (!email || email.trim() === '') {
            return res.status(400).json({ error: 'Email is required' });
        }
        const trimmedEmail = email.trim();

        //Password Validation
        if (!password || password.trim() === '') {
            return res.status(400).json({ error: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email',
            [trimmedUsername, trimmedEmail, hashedPassword] 
        );

        const user = result.rows[0]; // Get the user data
        generateToken(res, user.user_id);
        res.status(201).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        });

    } catch (error) {
        console.error('Register error:', error);
        next(error);
    }
};

// @desc     Logout user
// @route    POST /api/users/logout
// @access   Public
const logoutUser = async (req, res, next) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0),
        })

        res.status(201).json({ message: 'User logged out' });
    } catch (error) {
        next(error);
    }
};

// @desc     Get user profile
// @route    GET /api/users/profile
// @access   Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = {
            user_id: req.user.user_id,
            username: req.user.username,
            email: req.user.email
        }

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

// @desc     Update user profile
// @route    PUT /api/users/profile
// @access   Private
const updateUserProfile = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        let updates = [];
        let values = [];
        let index = 1;

        if(username && username.trim() !== '') {
            updates.push(`username = $${index++}`); //Add one to index after username is pushed to updates. 
            values.push(username.trim());
        }

        if(email && email.trim() !== '') {
            updates.push(`email = $${index++}`); //Add one to index after email is pushed to updates
            values.push(email.trim());
        }

        if (updates.length === 0) {
            const error = new Error('No fields to update');
            error.statusCode = 400;
            return next(error);
        }

        values.push(req.user.user_id); 
        const result = await pool.query(
            `UPDATE "user" SET ${updates.join(', ')} WHERE user_id = $${index} RETURNING user_id, username, email`,
            values
        );
        const user = result.rows[0];

        res.status(200).json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        });

    } catch (error) {
        next(error);
    }
};

// @desc     Update user password
// @route    PUT /api/users/password
// @access   Private
const updateUserPassword = async (req, res, next) => {
    try {
        //We can get the user by req.user but the password isn't stored in req.user. 
        //I want a field where the user can change their password after confirming their initial password
        //Therefore SQL SELECT will be used
        const result = await pool.query('SELECT * FROM "user" WHERE user_id = $1', [req.user.user_id]);
        const user = result.rows[0];

        //Check if user entered previous password correctly

        //Check if new password was entered
        const { password } = req.body;
        if(!password || password.trim() === '') {
            const error = new Error('Password not entered');
            error.statusCode = 400;
            return next(error);
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);
         //Make SQL UPDATE HERE
        await pool.query(
            'UPDATE "user" SET password = $1 WHERE user_id = $2',
            [hashedPassword, req.user.user_id]
        );

        res.status(200).json( {message: 'Password updated'} );
    } catch (error) {
        next(error);
    }
}

export { 
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserPassword
};