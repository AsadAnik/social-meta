import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import express from 'express';
import { notFoundMiddleware, errorHandlerMiddleware } from './error';
const app = express();

app.use(require('./middleware'));
app.use(require('./routes'));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV === 'production') {
    // Serve any static files..
    app.use(express.static(path.join(__dirname, '../../client/build')));

    // Handle react routing, return all requests to React App..
    app.get('*', (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
}

export default app;