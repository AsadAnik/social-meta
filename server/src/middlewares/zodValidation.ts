import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
         
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));

                res.status(StatusCodes.BAD_REQUEST).json({ 
                    error: 'Invalid data', 
                    details: errorMessages 
                });

            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    
                });
            }
        }
    };
}