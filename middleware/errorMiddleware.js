const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);
    res.json({
        //this err.message is coming from userController line-
        // throw new Error("Please add an email id");
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    });
};

module.exports = errorHandler;