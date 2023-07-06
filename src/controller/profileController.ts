import e, { RequestHandler } from 'express';
import { UserDetail } from '../models/userdetailModel';
import { Users } from '../models/userModel';
import { Provinces } from '../models/provincesModel';
import { Districts } from '../models/districtsModel';
import { SubDistricts } from '../models/sub_districtsModel';
const CryptoJS = require('crypto-js');
import dotenv from 'dotenv';
dotenv.config();
import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");




export const createUserDetail: RequestHandler = async (req, res) => {
    try {
        const iduser = req.body.user.id;
        const data: UserDetail = req.body;
        const userdetailfind = await UserDetail.findOne({ where: { iduser: iduser } });
        if (userdetailfind) {
            const userdetail = await UserDetail.update({
                iduser: iduser,
                fname: data.fname,
                lname: data.lname,
                province: data.province,
                district: data.district,
                sub_district: data.sub_district,
                email: data.email,
                card_id: data.card_id,
                status_user: data.status_user,
                phone_number: data.phone_number,
                birth_date: data.birth_date,
                gender: data.gender,
            }, { where: { iduser: iduser } });

            return res.status(200).json({ message: 'Update User Detail Success' });
        } else {
            const userdetail = await UserDetail.create({
                iduser: iduser,
                fname: data.fname,
                lname: data.lname,
                province: data.province,
                district: data.district,
                sub_district: data.sub_district,
                zip_code: data.zip_code,
                age: data.age,
                email: data.email,
                card_id: data.card_id,
                status_user: data.status_user,
                phone_number: data.phone_number,
                birth_date: data.birth_date,
                gender: data.gender,
            });
            return res.status(200).json({ message: 'Create User Detail Success' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getUserDetailByid: RequestHandler = async (req, res) => {
    try {
        const data: object[] = [];
        const userdetail = await UserDetail.findOne({ where: { iduser: req.body.user.id } });
        if (userdetail) {
            const sub_districts = await SubDistricts.findOne({ where: { zip_code: userdetail.zip_code } });
            const districts = await Districts.findOne({ where: { name_th: userdetail.district } });
            const provinces = await Provinces.findOne({ where: { name_th: userdetail.province } });
            data.push({
                fname: userdetail.fname,
                lname: userdetail.lname,
                province: userdetail.province,
                district: userdetail.district,
                sub_district: userdetail.sub_district,
                zip_code: userdetail.zip_code,
                provinces_id: provinces?.province_id,
                districts_id: districts?.districts_id,
                sub_districts_id: sub_districts?.sub_districts_id,
                age: userdetail.age,
                email: userdetail.email,
                card_id: userdetail.card_id,
                phone_number: userdetail.phone_number,
                birth_date: userdetail.birth_date,
                gender: userdetail.gender,
            });

            return res.status(200).json({ data: data[0] });
        } else {
            return res.status(400).json({ message: 'User Detail is not found' });
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}