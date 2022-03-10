import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';
import { createServer } from 'http';
import seedingRouter from './services/seedingJob.js'
import statusRouter from './services/botStatus.js'
import { badRequestErrorHandler, notFoundErrorHandler, catchAllErrorHandler } from "./errorHandler.js"


function connect(){
    const PORT = process.env.PORT || 3001;
    const app = express();
    app.use(cors());
    app.use(express.json());
    dotenv.config();

    app.use('/seedingjob', seedingRouter);
    app.use('/status', statusRouter);
    app.use(badRequestErrorHandler);
    app.use(notFoundErrorHandler);
    app.use(catchAllErrorHandler);

    const server = createServer(app);


    mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
        console.log('SUCCESS: connected to MONGODB');
        server.listen(PORT, () => {
            listEndpoints(app);
            console.log('SERVER listening on: ' + PORT);
        });
    });

}

connect()
