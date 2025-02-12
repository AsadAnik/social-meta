import express from 'express';
import { emailChecker, validationReq, AuthMiddleware } from '../middlewares';
import { AuthValidation } from '../utils/validation';
import { AuthController } from '../controllers';

const router = express.Router();

// Object instance for AuthController Class..
const authController = new AuthController();

/**
 * ---- Login User ----
 */
router.post('/login', validationReq(AuthValidation.loginUser), authController.login);

/**
 * ---- Register User ----
 */
router.post('/register', emailChecker, validationReq(AuthValidation.registerUser), authController.register);

/**
 * ---- Renew Access Token ----
 */
router.post('/refresh_token', authController.renewToken);

/**
 * ---- Forgot Password ----
 */
router.get('/forgot_password', authController.forgotPassword);

/**
 * ---- Logout User ----
 */
router.get('/logout', AuthMiddleware.verifyUser, authController.logout);

export default router;