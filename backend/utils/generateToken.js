import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    //Create Token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '31d'
    });

    //Save Token in Cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', //Site has to be https if not in development 
        sameSite: 'strict',
        maxAge: 31 * 24 * 60 * 60 * 1000 //31 days (in milliseconds)
    });
};

export default generateToken;