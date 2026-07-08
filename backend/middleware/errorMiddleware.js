const errorHandler = (err, req, res, next) => {
    // If statusCode is 200 (default), change it to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        // Include validation errors if available
        errors: err.errors || undefined
    });
};

module.exports = { errorHandler };
