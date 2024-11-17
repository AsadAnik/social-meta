import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

// auth middleware..
const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth;

    User.findOne({ token }, (err: Error, user: any) => {
        if (err) return res.json({isAuth: false, error: true, msg: err.message});
        if (!user) return res.json({isAuth: false, error: true, msg: 'User not found!'});

        (req as any).token = token;
        (req as any).user = user;
        next();
    });
}

export default auth;

// another way for creating middleware function and export it as module..
// export default function(req: Request, res: Response, next: NextFunction){
//     console.log('I am Auth Middleware!');
//     next();
// }
