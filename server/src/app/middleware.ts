import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Cors Config ---
const corsConfig: cors.CorsOptions = {
    credentials: true,
    origin: 'http://localhost:3000', // Explicitly allow the frontend origin
};

const middleware: any = [
    morgan('dev'),
    cors(corsConfig),
    bodyParser.json(),
    cookieParser()
];

export default middleware;