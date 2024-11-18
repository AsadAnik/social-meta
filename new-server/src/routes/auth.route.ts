import express, { Request, Response, NextFunction } from 'express';
import { emailChecker } from '../middlewares';
import { AuthController } from '../controllers';

const router = express.Router();

// Object instance for AuthController Class..
const authController = new AuthController();

/**
 * ---- Login User ----
 */
router.post('/login', authController.login);

/**
 * ---- Register User ----
 */
router.post('/register', emailChecker, authController.register);

/**
 * ---- Forgot Password ----
 */
router.get('/forgot_password', authController.forgotPassword);

export default router;