import { RequestHandler } from 'express';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { UserDetail } from '../models/userdetailModel';
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Users } from '../models/userModel';
import { UserRoom } from '../models/user_roomModel';
import { Op } from 'sequelize';
dayjs.locale("th");


export const getallRoom: RequestHandler = async (req, res) => {
    try {
        const room = await Room.findAll({ include: [{ model: RoomType, attributes: ['room_type_name', "room_price"] }] });
        res.status(200).json({ data: room });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const createRoom: RequestHandler = async (req, res) => {
    try {
        const roomfind = await Room.findOne({ where: { room_number: req.body.room_number } });
        if (roomfind) {
            return res.status(400).json({ message: 'หมายเลขห้องมีอยู่แล้ว' });
        } else {
            const data: Room = req.body;
            const room = await Room.create({
                idroom_type: data.idroom_type,
                room_number: data.room_number,
            });
            if (room) {
                return res.status(200).json({ message: 'สร้างข้อมูลห้องสำเร็จ' });
            } else {
                return res.status(400).json({ message: 'สร้างข้อมูลห้องไม่สำเร็จ' });
            }
        }

    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createRoomType: RequestHandler = async (req, res) => {
    try {
        const data: RoomType = req.body;

        if (!data.room_type_name || !data.room_price) {
            return res.status(400).json({ message: 'กรุณาตรวจสอบข้อมูลให้ครบ' });
        }

        if (data.room_type_name) {
            const roomtype = await RoomType.findOne({ where: { room_type_name: data.room_type_name } });
            if (roomtype) {
                return res.status(400).json({ message: 'ประเภทห้องมีอยู่แล้ว' });
            } else {
                const roomtype = await RoomType.create({
                    room_type_name: data.room_type_name,
                    room_price: data.room_price,
                    WaterMeterprice: data.WaterMeterprice,
                    ElectricMeterprice: data.ElectricMeterprice,
                });

                return res.status(200).json({ message: 'สร้างข้อมูลประเภทห้องสำเร็จ' });
            }
        } else {
            return res.status(400).json({ message: 'กรุณาตรวจสอบข้อมูลให้ครบ' });
        }
    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getRoomtype: RequestHandler = async (req, res) => {
    try {
        const roomtype = await RoomType.findAll();
        res.status(200).json({ data: roomtype });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getRoomTypeByid: RequestHandler = async (req, res) => {
    try {
        const roomtype = await RoomType.findOne({ where: { idroom_type: req.params.id } });
        if (roomtype) {
            return res.status(200).json({ data: roomtype });
        } else {
            return res.status(400).json({ message: 'ไม่เจอข้อมูลประเภทห้อง' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const updateRoomType: RequestHandler = async (req, res) => {
    try {
        const data: RoomType = req.body;
        const roomtype = await RoomType.findOne({ where: { idroom_type: req.params.id } });
        if (roomtype) {
            await RoomType.update({
                room_type_name: data.room_type_name,
                room_price: data.room_price,
                ElectricMeterprice: data.ElectricMeterprice,
                WaterMeterprice: data.WaterMeterprice,
                status_room_type: data.status_room_type
            }, { where: { idroom_type: req.params.id } });
            return res.status(200).json({ message: 'อัปเดตข้อมูลประเภทห้องสำเร็จ' });
        } else {
            return res.status(400).json({ message: 'ไม่เจอข้อมูลประเภทห้อง' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getRoomByid: RequestHandler = async (req, res) => {
    try {
        const room = await Room.findOne({ where: { idroom: req.params.id } });
        if (room) {
            return res.status(200).json({ data: room });
        } else {
            return res.status(400).json({ message: 'ไม่เจอข้อมูลห้อง' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const updateRoom: RequestHandler = async (req, res) => {
    const t = await Room.sequelize?.transaction();
    try {
        const data: Room = req.body;
        const room = await Room.findOne({ where: { idroom: req.params.id } });
        if (data.room_status === "empty") {
            const userroom = await UserRoom.findOne({ where: { idroom: req.params.id } });
            if (userroom) {
                await UserRoom.update({
                    status: "inactive",
                    date_out: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                }, { where: { idroom: req.params.id }, transaction: t });
            }
        }
        if (room) {
            await Room.update({
                idroom_type: data.idroom_type,
                room_number: data.room_number,
                room_status: data.room_status,
                status_room: data.status_room
            }, { where: { idroom: req.params.id }, transaction: t });
            await t?.commit();
            return res.status(200).json({ message: 'อัปเดตข้อมูลห้องสำเร็จ' });
        }
    }
    catch (err: any) {
        await t?.rollback();
        res.status(500).json({ message: err.message });
    }
}

export const getAllUserInRoom: RequestHandler = async (req, res) => {
    try {
        const userroom = await UserRoom.findAll({
            include: [
                {
                    model: Users, include: [{ model: UserDetail }],
                    where: { idrole: { [Op.ne]: 1 } }
                },
                { model: Room, include: [{ model: RoomType }] }],
        });

        if (userroom.length == 0) {
            return res.status(404).json({ message: 'ไม่มีผู้ใช้ในห้องนี้' });
        }

        const data: object[] = [];

        userroom.forEach((element: any) => {
            data.push({
                iduser: element.users.iduser,
                iduser_room: element.iduser_room,
                fname: element.users.user_detail[0]?.fname,
                lname: element.users.user_detail[0]?.lname,
                room_number: element.room.room_number,
                room_type_name: element.room.roomtype.room_type_name,
                date_in: element.date_in,
                date_out: element.date_out,
                status: element.status,
            });
        });


        return res.status(200).json({ data: data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getAllUserInRooms: RequestHandler = async (req, res) => {
    try {
        const userroom = await UserRoom.findAll({
            include: [{ model: Users, include: [{ model: UserDetail }] }, { model: Room, include: [{ model: RoomType }] }],
            where: { status: "active" }
        });

        if (userroom.length == 0) {
            return res.status(404).json({ message: 'ไม่มีผู้ใช้ในห้องนี้' });
        }

        const data: object[] = [];

        userroom.forEach((element: any) => {
            data.push({
                iduser_room: element.iduser_room,
                fname: element.users.user_detail[0]?.fname,
                lname: element.users.user_detail[0]?.lname,
                room_number: element.room.room_number,
                room_type_name: element.room.roomtype.room_type_name,
            });
        });


        return res.status(200).json({ data: data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


