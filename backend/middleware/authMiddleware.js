import pool from '../config/db.js'
import jwt from 'jsonwebtoken';

//Protect routes. Have to be logged in
const protect = async(req, res, next) => {
    try {
        let token;

        token = req.cookies.jwt;

        if(!token) {
            const error = new Error('Not authorized, no token');
            error.statusCode = 401;
            return next(error);
        }
        //Continue here if token === true
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Get everything except the password
        const result = await pool.query( 
            'SELECT user_id, username, email, created_at, updated_at FROM "user" WHERE user_id = $1', 
            [decoded.userId]);
        req.user = result.rows[0];

        next();
    } catch (error) {
         const err = new Error('Not authorized, invalid token');
         err.statusCode = 401;
         next(err);
    }
};

export { protect };