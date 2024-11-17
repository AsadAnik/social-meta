import express, { Request, Response, NextFunction } from 'express';
import { emailChecker } from '../middlewares';
import { login, register, forgotPassword } from '../controllers/auth.controller';

const router = express.Router();

/**
 * ---- Login User ----
 */
router.post('/login', login);

/**
 * ---- Register User ----
 */
router.post('/register', emailChecker, register);

/**
 * ---- Forgot Passsord ----
 */
router.get('/forgot_password', forgotPassword);

export default router;