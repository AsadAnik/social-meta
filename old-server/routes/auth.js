const router = require('express').Router();
const emailChecker = require('../middleware/emailCheck');
const { login, register, forgotPassword } = require('../controllers/auth.controller');


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

module.exports = router;