import express from 'express';
import { RequestHandler } from 'express';
import { Users } from '../models/userModel';
const CryptoJS = require('crypto-js');
import dotenv from 'dotenv';
dotenv.config();

export const getallUsers: RequestHandler = async (req, res) => {
    try {
        const users = await Users.findAll({attributes: { exclude: ['password'] }});
        res.status(200).json(users);
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
}

export const register: RequestHandler = async (req, res) => {
    try {
        const { username, password  } = req.body;
        const user = await Users.findOne({ where: { username: username } });
        if (user) {
            return res.status(400).json({ message: 'Username is already' });
        } else {
          let passwordencrypt = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
            const user = await Users.create({
                username: username,
                password: passwordencrypt,
                idrole: 1
            });
            return res.status(200).json({ message: 'Register Success' });
        }
    } catch (err:any) {
        return res.status(500).json({ message: err.message });
    }
}

export const ChangePassword: RequestHandler = async (req, res) => {
    try {
        const { oldPassword, password, confirmPassword } = req.body;
        const user = await Users.findOne({ where: { iduser: req.body.user.id } });
        if (user) {
            let passworddecrypt = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (passworddecrypt === oldPassword) {
                let passwordencrypt = CryptoJS.AES.encrypt(confirmPassword, process.env.SECRET_KEY).toString();
                const user = await Users.update({
                    password: passwordencrypt,
                }, { where: { iduser: req.body.user.id } });
                return res.status(200).json({ message: 'Change Password Success' });
            } else {
                return res.status(401).json({ message: 'Old Password is wrong' });
            }
        }
    }
    catch (err:any) {
        return res.status(500).json({ message: err.message });
    }
}

    