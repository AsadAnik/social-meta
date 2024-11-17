import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

/**
 * ---- Register Controller ----
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} _next 
 */
const register = async (req: Request, res: Response, _next: NextFunction) => {
    const user = new User(req.body);

    try {
        const docs = await user.save();
        res.status(200).json({
            success: true,
            message: 'User created successfully.',
            user: docs
        });
    } catch (error) {
        res.json({ success: false, error });
    }
};

/**
 * ---- Login Controller ----
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} _next 
 */
const login = async (req: Request, res: Response | any, _next: NextFunction) => {
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    try {
        const user = await User.findOne({ email: loginEmail });
        
        if (!user) return res.json({ isAuth: false, message: 'User not found!' });
        // compare password with registered user..
        const isMatch = await user.comparePassword(loginPassword);
        if (!isMatch) {
            return res.status(401).json({
                isAuth: false,
                message: 'Auth failed! wrong password!'
            });
        }

        // ganarate token when user login with fine..
        const token = await user.generateToken();
        res.cookie('auth', token).json({
            isAuth: true,
            id: user._id,
            email: user.email
        });
    } catch (err) {
        res.send(err);
    }
};

/**
 * ---- Forgot Password Controller ----
 * @param {Request} req 
 * @param {Response} res 
 */
const forgotPassword = async (_req: Request, res: Response) => {
    res.status(200).send('Route for forgot password!');
};

/**
 * ---- User Logout ----
 * @param {Request} req 
 * @param {Response} res 
 */
const logout = async (req: Request, res: Response) => {
    try {
        await (req as any).user.deleteToken();
        res.status(200).json({
            isAuth: false,
            msg: 'Logged-Out, session deleted!'
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

export {
    login,
    register,
    forgotPassword,
    logout
};