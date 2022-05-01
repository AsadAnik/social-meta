const express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    mongoose = require('mongoose')
    // config = require('./config').get(process.env.NODE_ENV),
    require('dotenv').config(),
    apiRouter = require('../routes/apiRouter');

// Exports init function..
module.exports.init = () => {
    // Connecting the mongoose and with it's Promise..
    const mongoOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
    };

    // Mongoose Promise..
    mongoose.Promise = global.Promise;

    // Mongoose Connection..
    // if use config.js file so it will be config.MONGO_URI..
    // if use .env file so it will be process.env.MONGO_URI..
    mongoose.connect(process.env.MONGO_URI, mongoOptions, function (error) {
        if (error) return console.log(error);
        console.log('------ Mongoose is connected! -------');
    });

    // initialize app..
    const app = express();

    // Middleware..
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors());

    // add a router..
    app.use('/api', apiRouter);

    if (process.env.NODE_ENV === 'production') {
        // Serve any static files..
        app.use(express.static(path.join(__dirname, '../../client/build')));

        // Handle react routing, return all requests to React App..
        app.get('*', function (req, res) {
            res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
        });
    }

    return app;
};