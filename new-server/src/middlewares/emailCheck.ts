// import model..
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// email checker middleware..
const emailChecker = (req: Request, res: Response, next: NextFunction) => {
    // User.find();
    const email = req.body.email;

    if (email.length > 0){
        User.find({email: email}, (err: Error, user: any) => {
            if (err) return res.send(err);
            if (!user) return res.json({ success: true });

            if (user.length > 0){
                if (user[0].email === email){
                    return res.json({
                        success: false,
                        message: 'Email is already taken!',
                        user
                    });
                }

                if (user[0].email !== email){
                   return next();
                }
            }

            return next();
        });
    }

    if (email.length === 0){
        return res.json({
            success: false,
            message: 'Email is empty!'
        });
    }
};

export default emailChecker;
