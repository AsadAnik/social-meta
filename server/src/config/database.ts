import mongoose from 'mongoose';

// Connecting the mongoose and with it's Promise..
// const mongoOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// };

// Mongoose Promise..
mongoose.Promise = global.Promise;
async function connectDB(URL: string) {
    return mongoose.connect(URL);
}

export default connectDB;