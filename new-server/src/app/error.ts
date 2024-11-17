import { Response, Request, NextFunction } from 'express';

/**
 * ==== Not Found ====
 * @param {express.Request} _req 
 * @param {express.Response} _res 
 * @param {express.NextFunction} next 
 */
const notFoundMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    const error = new Error('Resource Not Found!');
    (error as any).status = 404;
    next(error);
};

/**
 * ==== Error Handler ====
 * @param {Error} error 
 * @param {express.Request} _req 
 * @param {express.Response} res 
 * @returns 
 */
const errorHandlerMiddleware = (error: any, _req: Request, res: Response | any) => {
    const status = (error as any).status || 500;
    const message = error.message || "Something went wrong!";
    return res.status(status).json({ message });
};

export { notFoundMiddleware, errorHandlerMiddleware };