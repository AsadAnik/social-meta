import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { errorResponse } from '../lib';

class AuthController {
    /**
     * ---- Register Controller ----
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} _next 
     */
    public async register(req: Request, res: Response, _next: NextFunction) {
        const user = new User(req.body);

        try {
            const docs = await user.save();
            res.status(200).json({
                success: true,
                message: 'User created successfully.',
                user: docs,
            });
        } catch (error) {
            res.json({ success: false, error });
        }
    }

    /**
     * ---- Login Controller ----
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} _next 
     */
    public async login(req: Request, res: Response | any, next: NextFunction) {
        const loginEmail = req.body.email;
        const loginPassword = req.body.password;

        try {
            const user = await User.findOne({ email: loginEmail });
            
            if (!user) return errorResponse({ status: 404, message: 'User not found!', isAuth: false}, res);

            // compare password with registered user..
            const isMatch = await (user as any).comparePassword(loginPassword);
            if (!isMatch) return errorResponse({ status: 401, message: 'Auth failed! wrong password!', isAuth: false }, res);

            // generate token when user login with fine..
            const token = await (user as any).generateToken();
            res.cookie('auth', token).json({
                isAuth: true,
                id: user._id,
                email: user.email
            });

        } catch (err: unknown) {
            next(err);
        }
    }

    /**
     * ---- Forgot Password Controller ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public async forgotPassword(_req: Request, res: Response) {
        res.status(200).send('Route for forgot password!');
    }

    /**
     * ---- User Logout ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public async logout(req: Request, res: Response) {
        try {
            await (req as any).user.deleteToken();
            res.status(200).json({
                isAuth: false,
                msg: 'Logged-Out, session deleted!'
            });
        } catch (err) {
            res.status(400).send(err);
        }
    }
}

export default AuthController;