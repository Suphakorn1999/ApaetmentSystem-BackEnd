import { RequestHandler } from 'express';
import { Users } from '../models/userModel';
const CryptoJS = require('crypto-js');
import dotenv from 'dotenv';
dotenv.config();
const { generateToken } = require('../middlewares/jwtHandler');

export const login: RequestHandler = async (req, res) => {
    try {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });
    if (user) { 
        let passworddecrypt = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (passworddecrypt === password) {
            const token = generateToken({ id: user.iduser, username: user.username });
            return res.status(200).json({ message: 'Login Success', token: token , idrole: user.idrole });
        }else{
            return res.status(401).json({ message: 'Password is wrong' });
        }
    }else{
        return res.status(401).json({ message: 'Username is wrong' });
    }
    } catch (err:any) {
        return res.status(500).json({ message: err.message });
    }
} 