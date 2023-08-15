import express, { Express, Request, Response } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connection from './config/config';
import path from 'path';
dotenv.config();


const app: Express = express();
const port = process.env.PORT
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public/uploads')));

import userRouter from './routes/userRouter';
import loginRouter from './routes/loginRouter';
import provinceRouter from './routes/provinceRouter';
import profileRouter from './routes/profileRouter';
import RoomRouter from './routes/roomRouter';
import invoiceRouter from './routes/invoiceRouter';
import paymentRouter from './routes/paymentRouter';
import report from './routes/reportRouter';
import data from './routes/dataRouter';
import webboardRouter from './routes/webboardRouter';
import mailRouter from './routes/mailRouter';

app.use('/api/auth', [userRouter, loginRouter, provinceRouter, profileRouter, RoomRouter, invoiceRouter, paymentRouter, report, data, webboardRouter, mailRouter]);

app.use(
    (err: Error, req: Request, res: Response, next: express.NextFunction) => {
        res.status(500).json({ message: err.message });
    },
);

app.get('/', (req, res) => {
    res.send(
        `<h1 style=text-align:center;>
    🎉Welcome To API🎉
    </h1>`,
    );
});

connection
    .sync()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.log('Err', err);
    });

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});