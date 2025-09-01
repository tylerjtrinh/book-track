const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalURL}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; //IF we are throwing an error we don't want the status code to be 200
    let message = err.message;

    //Postgres Specific Errors
    if (err.code === '23505') {
        // Unique constraint violation
        statusCode = 400;
        
        // Check which field caused the violation
        if (err.detail && err.detail.includes('username')) {
            message = 'Username already exists';
        } else if (err.detail && err.detail.includes('email')) {
            message = 'Email already exists';
        } else {
            message = 'Resource already exists';
        }
    } else if (err.code === '23502') {
        // Not null constraint violation
        statusCode = 400;
        if (err.detail && err.detail.includes('username')) {
            message = 'Username is missing';
        } else if (err.detail && err.detail.includes('email')) {
            message = 'Email is missing';
        } else if (err.detail && err.detail.includes('password')) {
            message = 'Password is missing';
        } else {
            message = 'Required field is missing';
        }
    }



    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export { notFound, errorHandler };