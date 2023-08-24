import e, { RequestHandler } from 'express';
import { UserDetail } from '../models/userdetailModel';
import { Users } from '../models/userModel';
import { Provinces } from '../models/provincesModel';
import { Districts } from '../models/districtsModel';
import { SubDistricts } from '../models/sub_districtsModel';
import multer, { Multer } from 'multer';
const CryptoJS = require('crypto-js');
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { UserRoom } from '../models/user_roomModel';
import { Room } from '../models/roomModel';
import { Op } from 'sequelize';

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
            }, { where: { iduser: iduser } });

            return res.status(200).json({ message: 'อัปเดตข้อมูลพนักงานสำเร็จ' });
        } else {
            const userdetail = await UserDetail.create({
                iduser: iduser,
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
            });
            return res.status(200).json({ message: 'สร้างข้อมูลพนักงานสำเร็จ' });
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
            return res.status(404).json({ message: 'ไม่เจอข้อมูลผู้ใช้งาน' });
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
                            const mimetype = file.mimetype.split('/')[1];
                            cb(null, iduser + '.' + mimetype)
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
                        const mimetype = req.file?.mimetype.split('/')[1];
                        const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
                        if (data) {
                            if (userdetail) {
                                await UserDetail.update({
                                    partNameAvatar: iduser + '.' + mimetype,
                                }, { where: { iduser: iduser } });

                                return res.status(200).json({ message: 'อัปเดตรูปสำเร็จ' });
                            } else {
                                return res.status(400).json({ message: 'ไม่เจอผู้ใช้งาน' });
                            }
                        } else {
                            return res.status(400).json({ message: 'กรุณาเลือกรูป' });
                        }
                    }
                    )
                } else {
                    const storage = multer.diskStorage({
                        destination: function (req, file, cb) {
                            cb(null, './public/uploads/profile')
                        },
                        filename: function (req, file, cb) {
                            const mimetype = file.mimetype.split('/')[1];
                            cb(null, iduser + '.' + mimetype)
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
                        const mimetype = req.file?.mimetype.split('/')[1];
                        const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
                        if (data) {
                            if (userdetail) {
                                await UserDetail.update({
                                    partNameAvatar: iduser + '.' + mimetype,
                                }, { where: { iduser: iduser } });

                                return res.status(200).json({ message: 'อัปเดตรูปสำเร็จ' });
                            } else {
                                return res.status(400).json({ message: 'ไม่เจอผู้ใช้งาน' });
                            }
                        } else {
                            return res.status(400).json({ message: 'กรุณาเลือกรูป' });
                        }
                    }
                    )
                }
            } else {
                return res.status(400).json({ message: 'ไม่เจอข้อมูลพนักงาน' });
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
                        const mimetype = file.mimetype.split('/')[1];
                        cb(null, iduser + '.' + mimetype)
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
                    const mimetype = req.file?.mimetype.split('/')[1];
                    const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
                    if (data) {
                        if (userdetail) {
                            await UserDetail.update({
                                partNameAvatar: iduser + '.' + mimetype,
                            }, { where: { iduser: iduser } });

                            return res.status(200).json({ message: 'อัปเดตรูปสำเร็จ' });
                        } else {
                            return res.status(400).json({ message: 'ไม่เจอผู้ใช้งาน' });
                        }
                    } else {
                        return res.status(400).json({ message: 'กรุณาเลือกรูป' });
                    }
                }
                )
            } else {
                const storage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, './public/uploads/profile/')
                    },
                    filename: function (req, file, cb) {
                        const mimetype = file.mimetype.split('/')[1];
                        cb(null, iduser + '.' + mimetype)
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
                    const mimetype = req.file?.mimetype.split('/')[1];
                    const userdetail = await UserDetail.findOne({ where: { iduser: iduser } });
                    if (data) {
                        if (userdetail) {
                            await UserDetail.update({
                                partNameAvatar: iduser + '.' + mimetype,
                            }, { where: { iduser: iduser } });

                            return res.status(200).json({ message: 'อัปเดตรูปสำเร็จ' });
                        } else {
                            return res.status(400).json({ message: 'ไม่เจอผู้ใช้งาน' });
                        }
                    } else {
                        return res.status(400).json({ message: 'กรุณาเลือกรูป' });
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
        const data: object[] = [];
        const userdetail = await UserDetail.findAll({
            include: [{
                model: Users,
                where: {
                    idrole: { [Op.ne]: 1 }
                },
                include: [{
                    model: UserRoom,
                    required: false,
                    attributes: ['idroom', 'date_in', 'date_out'],
                    where: {
                        status: 'active'
                    },
                    include: [{
                        model: Room,
                        attributes: ['room_number']
                    }]
                }]
            }],
            where: {
                [Op.or]: [
                    { status_user: 'active' },
                    { status_user: 'inactive' }
                ]
            },
        });
        if (userdetail) {
            userdetail.forEach((userdetail) => {
                data.push({
                    iduser: userdetail.iduser,
                    idroom: userdetail.users?.user_room[0]?.idroom,
                    room_number: userdetail.users?.user_room[0]?.room?.room_number,
                    fname: userdetail.fname,
                    lname: userdetail.lname,
                    createdAt: userdetail.createdAt,
                    updatedAt: userdetail.updatedAt,
                    status_user: userdetail.status_user,
                    birth_date: userdetail.birth_date,
                    phone_number: userdetail.phone_number,
                    card_id: userdetail.card_id,
                    gender: userdetail.gender,
                    sub_district: userdetail.sub_district,
                    district: userdetail.district,
                    province: userdetail.province,
                    zip_code: userdetail.zip_code,
                    email: userdetail.email,
                    date_in: userdetail.users?.user_room[0]?.date_in,
                    date_out: userdetail.users?.user_room[0]?.date_out,
                })
            })
            return res.status(200).json({ data: data });
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูลผู้ใช้งาน' });
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
                status_user: userdetail.status_user,
                partNameAvatar: userdetail.partNameAvatar,
            });

            return res.status(200).json({ data: data[0] });
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูลพนักงาน' });
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
        if (userdetails) {
            await UserDetail.update({ ...data }, { where: { iduser: iduser } });
            return res.status(200).json({ message: 'อัปเดตข้อมูลพนักงานสำเร็จ' });
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูลพนักงาน' });
        }
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getIdroomByiduser: RequestHandler = async (req, res) => {
    try {
        const userRoom = await UserRoom.findOne({ where: { iduser: req.params.id, status: 'active' }, include: [{ model: Room, attributes: ['room_number'] }] });
        if (userRoom) {
            const data: object[] = [];
            data.push({
                iduser_room: userRoom.iduser_room,
                idroom: userRoom.idroom,
                room_number: userRoom.room.room_number,
                deposit: userRoom.deposit,
                watermeterstart: userRoom.watermeterstart,
                electricmeterstart: userRoom.electricmeterstart,
                date_in: userRoom.date_in,
                date_out: userRoom.date_out,
            });
            return res.status(200).json({ data: data[0] });
        }
        else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูลห้องพัก' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const updateidRoomByiduser: RequestHandler = async (req, res) => {
    const t = await UserRoom.sequelize?.transaction();
    try {
        const iduser = req.params.id;
        const idroom = req.body.idroom;
        const date_out = req.body.date_out;
        const date_in = req.body.date_in;
        const room_number = req.body.room_number;
        const deposit = req.body.deposit;
        const watermeterstart = req.body.watermeterstart;
        const electricmeterstart = req.body.electricmeterstart;
        const userRoom = await UserRoom.findOne({ where: { iduser: iduser, status: 'active' }, include: [{ model: Room, attributes: ['room_status'] }] });
        if (date_out !== null && date_out !== undefined) {
            if (userRoom) {
                if (userRoom.room.room_status == 'full') {
                    if (userRoom.idroom == idroom) {
                        await UserRoom.update({ date_out: date_out, status: 'inactive' }, { where: { iduser: iduser, date_in: req.body.date_in }, transaction: t });
                        await Room.update({ room_status: 'empty' }, { where: { idroom: idroom }, transaction: t });
                        await t?.commit();
                        return res.status(200).json({ message: 'อัปเดตห้องพักสำเร็จ' });
                    } else {
                        return res.status(400).json({ message: 'ห้องพักนี้มีผู้เช่าคนอื่นอยู่' });
                    }
                } else {
                    return res.status(400).json({ message: 'ห้องพักไม่ว่าง' });
                }
            }
        }
        if (userRoom) {
            if (userRoom.room.room_status == 'full') {
                if (userRoom.idroom == idroom) {
                    await UserRoom.update({ idroom: idroom, date_in: date_in, deposit: deposit, watermeterstart: watermeterstart, electricmeterstart: electricmeterstart }, { where: { iduser_room: userRoom.iduser_room } });
                    return res.status(200).json({ message: 'อัปเดตห้องพักสำเร็จ' });
                } else {
                    return res.status(400).json({ message: 'ห้องพักนี้มีผู้เช่าคนอื่นอยู่' });
                }
            } else {
                const userRoom = await UserRoom.findOne({ where: { iduser: iduser } });
                if (userRoom) {
                    await UserRoom.update({ idroom: idroom, date_in: date_in, deposit: deposit, watermeterstart: watermeterstart, electricmeterstart: electricmeterstart }, { where: { iduser_room: userRoom.iduser_room }, transaction: t });
                    await Room.update({ room_status: 'full' }, { where: { idroom: idroom }, transaction: t });
                    await t?.commit();
                    return res.status(200).json({ message: 'อัปเดตห้องพักสำเร็จ' });
                } else {
                    await UserRoom.create({ iduser: iduser, idroom: idroom, date_in: date_in, deposit: deposit, watermeterstart: watermeterstart, electricmeterstart: electricmeterstart }, { transaction: t });
                    await Room.update({ room_status: 'full' }, { where: { idroom: idroom }, transaction: t });
                    await t?.commit();
                    return res.status(200).json({ message: 'อัปเดตห้องพักสำเร็จ' });
                }
            }
        } else {
            if (idroom == null || idroom == undefined || idroom == 0) {
                const room = await Room.findOne({ where: { room_number: room_number } });
                if (room) {
                    if (room.room_status == 'full') {
                        return res.status(400).json({ message: 'ห้องพักไม่ว่าง' });
                    } else {
                        await UserRoom.create({ iduser: iduser, idroom: room.idroom, date_in: date_in, deposit: deposit, watermeterstart: watermeterstart, electricmeterstart: electricmeterstart }, { transaction: t });
                        await Room.update({ room_status: 'full' }, { where: { idroom: room.idroom }, transaction: t });
                        await t?.commit();
                        return res.status(200).json({ message: 'อัปเดตห้องพักสำเร็จ' });
                    }
                }
            } else {
                const room = await Room.findOne({ where: { idroom: idroom } });
                if (room) {
                    if (room.room_status == 'full') {
                        return res.status(400).json({ message: 'ห้องพักไม่ว่าง' });
                    } else {
                        await UserRoom.create({ iduser: iduser, idroom: idroom, date_in: date_in, deposit: deposit, watermeterstart: watermeterstart, electricmeterstart: electricmeterstart }, { transaction: t });
                        await Room.update({ room_status: 'full' }, { where: { idroom: idroom }, transaction: t });
                        await t?.commit();
                        return res.status(200).json({ message: 'อัปเดตห้องพักสำเร็จ' });
                    }
                } else {
                    return res.status(400).json({ message: 'ไม่เจอห้องพัก' });
                }
            }
        }
    } catch (err: any) {
        await t?.rollback();
        res.status(500).json({ message: err.message });
    }
}