import http from 'http';
import { config, connectDB } from './config';
import app from './app/app';

const HOST: string = String(process.env.HOST || 'localhost');
const PORT: number = Number(process.env.PORT || 8080);
const DB_URI: string =  String(process.env.MONGO_URI || 'mongodb://localhost:27017/socialMeta');

// Node server..
const server: http.Server = http.createServer(app);

// DB Connection and server Listening..
connectDB(DB_URI)
    .then(() => {
        console.log('------ Database is connected! -------');
        // Listening to Server..
        server.listen(PORT, HOST, () => {
            console.log(`Welcome to -- ${process.env.APP_NAME} -- `);
            console.log(`Server is running on http://${HOST}:${PORT}`);
        });
    })
    .catch((error: Error) => {
        console.log('ERR! Can\'t Connected with Database! --> ', error.message);
    });