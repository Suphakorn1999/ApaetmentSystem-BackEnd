import express from 'express';
import { RequestHandler } from 'express';
import { Users } from '../models/userModel';
import { Role } from '../models/roleModel';
const CryptoJS = require('crypto-js');
import dotenv from 'dotenv';
dotenv.config();

export const getallUsers: RequestHandler = async (req, res) => {
    try {
        const users = await Users.findAll({attributes: { exclude: ['password'] }});
        res.status(200).json({ data: users, message: 'ดึงข้อมูลผู้ใช้งานสำเร็จ' });
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
}

export const register: RequestHandler = async (req, res) => {
    try {
        const { username, idrole } = req.body;
        const user = await Users.findOne({ where: { username: username } });
        if (user) {
            return res.status(400).json({ message: 'มีชื่อผู้ใช้อยู่แล้ว' });
        } else {
            let passwordencrypt = CryptoJS.AES.encrypt(username, process.env.SECRET_KEY).toString();
            const user = await Users.create({
                username: username,
                password: passwordencrypt,
                idrole: idrole,
            });
            return res.status(200).json({ message: 'ลงทะเบียนสำเร็จ' });
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
                return res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
            } else {
                return res.status(401).json({ message: 'รหัสผ่านเก่าไม่ถูกต้อง' });
            }
        }
    }
    catch (err:any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getRoles: RequestHandler = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({ data: roles, message: 'ดึงข้อมูลสิทธิผู้ใช้งานสำเร็จ' });
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
}

    