const mongoose = require('mongoose');

// Connecting the mongoose and with it's Promise..
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
};

// Mongoose Promise..
mongoose.Promise = global.Promise;

async function connectDB(URL) {
    const connection = await mongoose.connect(URL, mongoOptions);
    return connection;
}

module.exports = connectDB;