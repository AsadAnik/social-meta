/**
 * ==== Not Found ====
 * @param {*} _req 
 * @param {*} _res 
 * @param {*} next 
 */
const notFoundMiddleware = (_req, _res, next) => {
    const error = new Error('Resource Not Found!');
    error.status = 404;
    next(error);
};

/**
 * ==== Error Handler ====
 * @param {*} error 
 * @param {*} _req 
 * @param {*} res 
 * @returns 
 */
const errorHandlerMiddleware = (error, _req, res) => {
    // console.log('Global handler -- ', error);
    // set status and message here..
    const status = error.status ? error.status : 500;
    const message = error.message ? error.message : "Something went wrong!";
    return res.status(status).json({ message });
};

module.exports = {
    notFoundMiddleware,
    errorHandlerMiddleware
};