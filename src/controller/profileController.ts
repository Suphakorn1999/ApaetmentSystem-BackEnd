import e, { RequestHandler } from 'express';
import { UserDetail } from '../models/userdetailModel';
import { Users } from '../models/userModel';
import { Provinces } from '../models/provincesModel';
import { Districts } from '../models/districtsModel';
import { SubDistricts } from '../models/sub_districtsModel';
import { Room } from '../models/roomModel';
import multer, { Multer } from 'multer';
const CryptoJS = require('crypto-js');
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';

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

export const getUserDetailByToken: RequestHandler = async (req, res) => {
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
                partNameAvatar: userdetail.partNameAvatar,
            });

            return res.status(200).json({ data: data[0] });
        } else {
            return res.status(404).json({ message: 'User Detail is not found' });
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const uploadImage: RequestHandler = async (req, res) => {
    try {
        const iduser = req.body.user.id;
        const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
        if (userdetail == null) {
            const createuser = await UserDetail.create({
                iduser: iduser,
                partNameAvatar: null
            });
            if (createuser) {
                if (createuser?.partNameAvatar !== null) {
                    const paths = path.join(__dirname, '../../public/uploads/profile') + '/' + createuser?.partNameAvatar;
                    fs.unlinkSync(paths)

                    const storage = multer.diskStorage({
                        destination: function (req, file, cb) {
                            cb(null, './public/uploads/profile')
                        },
                        filename: function (req, file, cb) {
                            cb(null, iduser + '.' + file.originalname.split('.')[1])
                        }
                    })

                    const upload = multer({ storage: storage }).single('file');
                    upload(req, res, async function (err) {
                        if (err instanceof multer.MulterError) {
                            return res.status(500).json({ message: err.message });
                        }
                        else if (err) {
                            return res.status(500).json({ message: err.message });
                        }

                        const data: any = req.file
                        const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
                        if (data) {
                            if (userdetail) {
                                await UserDetail.update({
                                    partNameAvatar: iduser + '.' + data.originalname.split('.')[1],
                                }, { where: { iduser: iduser } });

                                return res.status(200).json({ message: 'Upload image success' });
                            } else {
                                return res.status(400).json({ message: 'User Detail is not found' });
                            }
                        } else {
                            return res.status(400).json({ message: 'Please select image' });
                        }
                    }
                    )
                } else {
                    const storage = multer.diskStorage({
                        destination: function (req, file, cb) {
                            cb(null, './public/uploads/profile')
                        },
                        filename: function (req, file, cb) {
                            cb(null, iduser + '.' + file.originalname.split('.')[1])
                        }
                    })

                    const upload = multer({ storage: storage }).single('file');
                    upload(req, res, async function (err) {
                        if (err instanceof multer.MulterError) {
                            return res.status(500).json({ message: err.message });
                        }
                        else if (err) {
                            return res.status(500).json({ message: err.message });
                        }

                        const data: any = req.file
                        const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
                        if (data) {
                            if (userdetail) {
                                await UserDetail.update({
                                    partNameAvatar: iduser + '.' + data.originalname.split('.')[1],
                                }, { where: { iduser: iduser } });

                                return res.status(200).json({ message: 'Upload image success' });
                            } else {
                                return res.status(400).json({ message: 'User Detail is not found' });
                            }
                        } else {
                            return res.status(400).json({ message: 'Please select image' });
                        }
                    }
                    )
                }
            }else{
                return res.status(400).json({ message: 'User Detail is not found' });
            }
        } else {
            if (userdetail?.partNameAvatar !== null) {
                const paths = path.join(__dirname, '../../public/uploads/profile') + '/' + userdetail?.partNameAvatar;
                fs.unlinkSync(paths)

                const storage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, './public/uploads/profile/')
                    },
                    filename: function (req, file, cb) {
                        cb(null, iduser + '.' + file.originalname.split('.')[1])
                    }
                })

                const upload = multer({ storage: storage }).single('file');
                upload(req, res, async function (err) {
                    if (err instanceof multer.MulterError) {
                        return res.status(500).json({ message: err.message });
                    }
                    else if (err) {
                        return res.status(500).json({ message: err.message });
                    }

                    const data: any = req.file
                    const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
                    if (data) {
                        if (userdetail) {
                            await UserDetail.update({
                                partNameAvatar: iduser + '.' + data.originalname.split('.')[1],
                            }, { where: { iduser: iduser } });

                            return res.status(200).json({ message: 'Upload image success' });
                        } else {
                            return res.status(400).json({ message: 'User Detail is not found' });
                        }
                    } else {
                        return res.status(400).json({ message: 'Please select image' });
                    }
                }
                )
            } else {
                const storage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, './public/uploads/')
                    },
                    filename: function (req, file, cb) {
                        cb(null, iduser + '.' + file.originalname.split('.')[1])
                    }
                })

                const upload = multer({ storage: storage }).single('file');
                upload(req, res, async function (err) {
                    if (err instanceof multer.MulterError) {
                        return res.status(500).json({ message: err.message });
                    }
                    else if (err) {
                        return res.status(500).json({ message: err.message });
                    }

                    const data: any = req.file
                    const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
                    if (data) {
                        if (userdetail) {
                            await UserDetail.update({
                                partNameAvatar: iduser + '.' + data.originalname.split('.')[1],
                            }, { where: { iduser: iduser } });

                            return res.status(200).json({ message: 'Upload image success' });
                        } else {
                            return res.status(400).json({ message: 'User Detail is not found' });
                        }
                    } else {
                        return res.status(400).json({ message: 'Please select image' });
                    }
                }
                )
            }
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getUserAllDetail: RequestHandler = async (req, res) => {
    try {
        const userdetail = await UserDetail.findAll();
        if (userdetail) {
            return res.status(200).json({ data: userdetail });
        } else {
            return res.status(404).json({ message: 'User Detail is not found' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getUserDetailbyid: RequestHandler = async (req, res) => {
    try {
        const userdetail = await UserDetail.findOne({ where: { iduser: req.params.id } });
        if (userdetail) {
            const sub_districts = await SubDistricts.findOne({ where: { zip_code: userdetail.zip_code } });
            const districts = await Districts.findOne({ where: { name_th: userdetail.district } });
            const provinces = await Provinces.findOne({ where: { name_th: userdetail.province } });
            const data: object[] = [];
            data.push({
                iduser: userdetail.iduser,
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
                deposit: userdetail.deposit,
                date_in: userdetail.date_in,
                date_out: userdetail.date_out,
                idroom: userdetail.idroom,
                status_user: userdetail.status_user,
                partNameAvatar: userdetail.partNameAvatar,
                createdAt: userdetail.createdAt,
                updatedAt: userdetail.updatedAt,
            });

            return res.status(200).json({ data: data[0] });
        } else {
            return res.status(404).json({ message: 'User Detail is not found' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const updateUserUserDetailByid: RequestHandler = async (req, res) => {
    try {
        const iduser = req.params.id;
        const data: UserDetail = req.body;
        const userdetails = await UserDetail.findOne({ where: { iduser: iduser } });

        if(data.idroom !== null){
            const room = await Room.findOne({ where: { idroom: data.idroom } });
            if(room){
                if(room?.room_status === 'full'){
                    return res.status(400).json({ message: 'Room is not available' });
                }else{
                    await Room.update({
                        room_status: 'full',
                    }, { where: { idroom: data.idroom } });
                }
            }
                
        }
        if (userdetails) {
            const userdetail = await UserDetail.update({
                fname: data.fname,
                lname: data.lname,
                age: data.age,
                email: data.email,
                sub_district: data.sub_district,
                district: data.district,
                province: data.province,
                zip_code: data.zip_code,
                card_id: data.card_id,
                birth_date: data.birth_date,
                phone_number: data.phone_number,
                gender: data.gender,
                status_user: data.status_user,
                date_in: data.date_in,
                date_out: data.date_out,
                deposit: data.deposit,
                idroom: data.idroom,
            }, { where: { iduser: iduser } });

            return res.status(200).json({ message: 'Update User Detail Success' });
        } else {
            return res.status(404).json({ message: 'User Detail is not found' });
        }
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}