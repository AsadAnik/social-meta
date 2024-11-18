const User = require('../models/user');

/**
 * ---- Register Controller ----
 * @param {*} req 
 * @param {*} res 
 * @param {*} _next 
 */
const register = function (req, res, _next) {
    const user = new User(req.body);

    user.save(function (error, docs) {
        if (error) return res.json({ success: false, error });
        res.status(200).json({
            success: true,
            message: 'User created successfully.',
            user: docs
        });
    });
};

/**
 * ---- Login Controller ----
 * @param {*} req 
 * @param {*} res 
 * @param {*} _next 
 */
const login = function (req, res, _next) {
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    User.findOne({ email: loginEmail }, function (err, user) {
        if (err) return res.json({ isAuth: false, message: 'Auth failed! wrong email!' });
        if (!user) return res.json({ isAuth: false, message: 'User not found!' });

        // compare password with registered user..
        user.comparePassword(loginPassword, function (err, isMatch) {
            if (!isMatch) return res.json({
                isAuth: false,
                message: 'Auth failed! wrong password!'
            });
            if (err) return res.send(err);

            // ganarate token when user login with fine..
            user.ganarateToken(function (err, user) {
                if (err) return res.status(400).send(err);

                res.cookie('auth', user.token).json({
                    isAuth: true,
                    id: user._id,
                    email: user.email
                });
            });
        });
    });
};

/**
 * ---- Forgot Password Controller ----
 * @param {*} req 
 * @param {*} res 
 */
const forgotPassword = (_req, res) => {
    res.status(200).send('Route for forgot password!');
};

/**
 * ---- User Logout ----
 * @param {*} req 
 * @param {*} res 
 */
const logout = function (req, res) {
    req.user.deleteToken(function (err) {
        if (err) return res.status(400).send(err);
        res.status(200).json({
            isAuth: false,
            msg: 'Logged-Out, session deleted!'
        });
    });
};

module.exports = {
    login,
    register,
    forgotPassword,
    logout
};