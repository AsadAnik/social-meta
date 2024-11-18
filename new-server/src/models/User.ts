// User Model..
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

const SALT_I = 10;

// user Schema..
const userSchema = new Schema({
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
userSchema.pre('save', function (next: any) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_I, (err: Error | undefined, salt: string) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err: Error | undefined, hash: string) => {
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
userSchema.methods.comparePassword = function(candidatePassword: string, cb: (err: Error | null, isMatch: boolean) => void){
    const user = this;

    bcrypt.compare(candidatePassword, user.password, (err: Error | undefined, isMatch: boolean) => {
        if (err) return cb(err, false);
        cb(null, isMatch);
    });
};

// Schema Method to genarate token for cookie when user loggin..
userSchema.methods.generateToken = function(cb: (err: Error | null, user: any | null) => void){
    const user = this;
    const token = JWT.sign(user._id.toHexString(), String(process.env.SECRET));
    user.token = token;

    user.save((err: Error | undefined, user: any) => {
        if (err) return cb(err, null);
        cb(null, user);
    });
};

// Find user by his loggedin token..
userSchema.statics.findByToken = function(token: string, cb: (err: Error | null, user: any | null) => void){
    const user = this;

    JWT.verify(token, String(process.env.SECRET), { algorithms: ['HS256'] }, (err: any, decodedToken: any) => {
        if (err) return cb(err, null);

        user.findOne({_id: decodedToken, token: token}, (err: Error | undefined, user: any) => {
            if (err) return cb(err, null);
            cb(null, user);
        });
    });
};

// Delete token with method..
userSchema.methods.deleteToken = function(cb: (err: Error | null) => void){
    const user = this;

    user.updateOne({$unset: {token: 1}}, (err: Error | undefined) => {
        if (err) return cb(err);
        cb(null);
    });
};


// user Model..
const User = mongoose.model('User', userSchema);

export default User;
