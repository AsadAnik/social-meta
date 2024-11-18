// import Model..
const User = require('../models/user');

// auth middleware..
const auth = function(req, res, next){
    const token = req.cookies.auth;

    User.findByToken(token, function(err, user){
        if (err) return res.json({isAuth: false, error: true, msg: err.message});
        if (!user) return res.json({isAuth: false, error: true, msg: 'User not found!'});

        req.token = token;
        req.user = user;
        next();
    });
}

module.exports = auth;

// another way for creating middleware function and export it as module..
// module.exports = function(req, res, next){
//     console.log('I am Auth Middleware!');
//     next();
// }
