import { RequestHandler } from 'express';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { UserDetail } from '../models/userdetailModel';
import dayjs from "dayjs";
import "dayjs/locale/th";
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
            return res.status(400).json({ message: 'หมายเลขห้องมีอยู่แล้ว'});
        }else{
            const data: Room = req.body;
            const room = await Room.create({
                idroom_type: data.idroom_type,
                room_number: data.room_number,
            });
            if(room){
                return res.status(200).json({ message: 'สร้างข้อมูลห้องสำเร็จ' });
            }else{
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
        const data:RoomType = req.body;

        if (!data.room_type_name || !data.room_price) {
            return res.status(400).json({ message: 'กรุณาตรวจสอบข้อมูลให้ครบ' });
        }

        if (data.room_type_name) {
            const roomtype = await RoomType.findOne({ where: { room_type_name: data.room_type_name } });
            if (roomtype) {
                return res.status(400).json({ message: 'ประเภทห้องมีอยู่แล้ว' });
            }else{
                const roomtype = await RoomType.create({
                    room_type_name: data.room_type_name,
                    room_price: data.room_price,
                    WaterMeterprice: data.WaterMeterprice,
                    ElectricMeterprice: data.ElectricMeterprice,
                });
    
                return res.status(200).json({ message: 'สร้างข้อมูลประเภทห้องสำเร็จ' });
            }
        }else {
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
        const data:RoomType = req.body;
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
    try{
        const data:Room = req.body;
        const room = await Room.findOne({ where: { idroom: req.params.id } });
        if(data.room_status === "empty"){
            const userdetail = await UserDetail.findOne({ where: { idroom: data.idroom } });
            if(userdetail){
                await UserDetail.update({
                    idroom: null,
                }, { where: { idroom: data.idroom } });
            }
        }
        if (room) {
            await Room.update({
                idroom_type: data.idroom_type,
                room_number: data.room_number,
                room_status: data.room_status,
                status_room: data.status_room
            }, { where: { idroom: req.params.id } });
            return res.status(200).json({ message: 'อัปเดตข้อมูลห้องสำเร็จ' });
        }
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


