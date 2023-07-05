import { RequestHandler } from 'express';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
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
            return res.status(400).json({ message: 'Room number is already' });
        }else{
            const data: Room = req.body;
            const room = await Room.create({
                idroom_type: data.idroom_type,
                room_number: data.room_number,
                createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            });
            if(room){
                return res.status(200).json({ message: 'Create Room Success' });
            }else{
                return res.status(400).json({ message: 'Create Room Fail' });
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
            return res.status(400).json({ message: 'Please fill all field' });
        }

        if (data.room_type_name) {
            const roomtype = await RoomType.findOne({ where: { room_type_name: data.room_type_name } });
            if (roomtype) {
                return res.status(400).json({ message: 'Room type is already' });
            }else{
                const roomtype = await RoomType.create({
                    room_type_name: data.room_type_name,
                    room_price: data.room_price,
                    WaterMeterprice: data.WaterMeterprice,
                    ElectricMeterprice: data.ElectricMeterprice,
                    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                });
    
                return res.status(200).json({ message: 'Create Room Type Success' });
            }
        }else {
            return res.status(400).json({ message: 'Please fill all field' });
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
            return res.status(400).json({ message: 'Room type is not found' });
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
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                status_room_type: data.status_room_type
            }, { where: { idroom_type: req.params.id } });
            return res.status(200).json({ message: 'Update Room Type Success' });
        } else {
            return res.status(400).json({ message: 'Room type is not found' });
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
            return res.status(400).json({ message: 'Room is not found' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const updateRoom: RequestHandler = async (req, res) => {
    try{
        const data:Room = req.body;
        const room = await Room.findOne({ where: { idroom: req.params.id } });
        if (room) {
            await Room.update({
                idroom_type: data.idroom_type,
                room_number: data.room_number,
                room_status: data.room_status,
                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                status_room: data.status_room
            }, { where: { idroom: req.params.id } });
            return res.status(200).json({ message: 'Update Room Success' });
        }
    }
    catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


