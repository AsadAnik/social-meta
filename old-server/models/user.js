// User Model..
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const config = require('../config/config').get(process.env.NODE_ENV);

const SALT_I = 10;

// user Schema..
const userSchema = mongoose.Schema({
    firstname: { type: String, required: false, maxLength: 100 },
    lastname: { type: String, required: false, maxLength: 100 },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minLength: 7 },
    bio: { type: String, required: false },
    profilePhoto: { type: String, default: "avatar" },
    coverPhoto: { type: String, default: "cover" },
    birthdate: { type: String },
    title: { type: String },
    themeMode: { type: String, required: false, default: 'lightMode' },
    colorMode: { type: String, required: false, default: 'royalblue' },
    token: { type: String },
    followings: { type: Array },
    followers: { type: Array }
}, {    
    timestamps: true
});

// Schema Middleware to hashing password..
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_I, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);

                user.password = hash;
                next();
            });
        });

    } else {
        next();
    }
});

// Schema Method to compare login pass to register pass.
userSchema.methods.comparePassword = function(candidatePassword, cb){
    var user = this;

    bcrypt.compare(candidatePassword, user.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Schema Method to genarate token for cookie when user loggin..
userSchema.methods.ganarateToken = function(cb){
    var user = this;
    var token = JWT.sign(user._id.toHexString(), config.SECRET);
    user.token = token;

    user.save(function(err, user){
        if (err) return cb(err);
        cb(null, user);
    });
};

// Find user by his loggedin token..
userSchema.statics.findByToken = function(token, cb){
    var user = this;

    JWT.verify(token, config.SECRET, function(err, decode){
        if (err) return cb(err);

        user.findOne({_id: decode, token: token}, function(err, user){
            if (err) return cb(err);
            cb(null, user);
        });
    });
};

// Delete token with method..
userSchema.methods.deleteToken = function(cb){
    var user = this;

    user.updateOne({$unset: {token: 1}}, function(err){
        if (err) return cb(err);
        cb(null);
    });
};

// Middleware to delete posts when a user is removed
userSchema.pre('remove', async function (next) {
    try {
        // Delete all posts associated with this user
        await Post.deleteMany({ ownerId: this._id });
        next();
    } catch (error) {
        next(error);
    }
});


// user Model..
const User = mongoose.model('User', userSchema);

module.exports = User;
