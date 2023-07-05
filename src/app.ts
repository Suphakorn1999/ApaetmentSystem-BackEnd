import express, { Express, Request, Response } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connection from './config/config';
dotenv.config();


const app: Express = express();
const port = process.env.PORT
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


import userRouter from './routes/userRouter';
import loginRouter from './routes/loginRouter';
import provinceRouter from './routes/provinceRouter';
import profileRouter from './routes/profileRouter';
import RoomRouter from './routes/roomRouter';

app.use('/api/auth', [userRouter, loginRouter, provinceRouter, profileRouter, RoomRouter]);


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