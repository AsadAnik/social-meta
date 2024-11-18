const morgan = require("morgan"),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser");

// Cors Config ---
const corsConfig = {
    credentials: true,
    origin: true,
};

const middleware = [
    morgan('dev'),
    cors(corsConfig),
    bodyParser.json(),
    cookieParser()
];


module.exports = middleware;