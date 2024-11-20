import { Response, NextFunction } from 'express';

// ERROR TYPE..
type errorType = {
    status: number;
    message: string;
    [key: string]: any;
};

/**
 * ==== Error Handler ====
 * @param {Error} error 
 * @param {express.Response} res 
 * @returns 
 */
const errorResponse = (error: errorType, res: Response | any, _next?: NextFunction) => {
    const status = (error as any).status || 500;
    const message = error.message || "Something went wrong!";
    res.status(status).json({ ...error, message, status, isSuccess: false });
};

export default errorResponse;
