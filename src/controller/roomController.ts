import { RequestHandler } from 'express';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { UserDetail } from '../models/userdetailModel';
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Users } from '../models/userModel';
import { UserRoom } from '../models/user_roomModel';
import { Op, Sequelize, where } from 'sequelize';
import { Invoice } from '../models/invoiceModel';
import { Payment } from '../models/paymentModel';
dayjs.locale("th");


export const getallRoom: RequestHandler = async (req, res) => {
    try {
        const room = await Room.findAll({ include: [{ model: RoomType, attributes: ['room_type_name', "room_price"] }] });
        room.sort((a: any, b: any) => a.createdAt - b.createdAt);
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

export const getRoomtypedrop: RequestHandler = async (req, res) => {
    try {
        const roomtype = await RoomType.findAll({ where: { status_room_type: "active" } });
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
    let t:any = null;
    try {
        t = await Room.sequelize?.transaction();
        const data: Room = req.body;
        const room = await Room.findOne({ where: { idroom: req.params.id } });
        if (data.status_room === "inactive") {
            const userroom = await UserRoom.findOne({ where: { idroom: req.params.id, status: 'active' } });
            if(data.room_number != room?.room_number){
                const roomfind = await Room.findOne({ where: { room_number: data.room_number } });
                if(roomfind){
                    return res.status(400).json({ message: 'หมายเลขห้องมีอยู่แล้ว' });
                }
            }
            if (userroom) {
                return res.status(400).json({ message: 'ห้องนี้มีผู้ใช้อยู่' });
            } else {
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
        if (data.room_status === "empty") {
            const userroom = await UserRoom.findOne({ where: { idroom: req.params.id } });
            if (data.room_number != room?.room_number) {
                const roomfind = await Room.findOne({ where: { room_number: data.room_number } });
                if(roomfind){
                    return res.status(400).json({ message: 'หมายเลขห้องมีอยู่แล้ว' });
                }
            }
            if (userroom) {
                await UserRoom.update({
                    status: "inactive",
                    date_out: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                }, { where: { idroom: req.params.id, status: 'active' }, transaction: t });

                await Room.update({
                    idroom_type: data.idroom_type,
                    room_number: data.room_number,
                    room_status: data.room_status,
                    status_room: data.status_room
                }, { where: { idroom: req.params.id }, transaction: t });

                await t?.commit();
                return res.status(200).json({ message: 'อัปเดตข้อมูลห้องสำเร็จ' });
            } else {
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
        if (room) {
            if(data.room_number != room?.room_number){
                const roomfind = await Room.findOne({ where: { room_number: data.room_number } });
                if(roomfind){
                    return res.status(400).json({ message: 'หมายเลขห้องมีอยู่แล้ว' });
                }
            }
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
        if(t) await t?.rollback();
        res.status(500).json({ message: err.message });
    }
}

export const getAllUserInRoom: RequestHandler = async (req, res) => {
    try {
        const userroom = await UserRoom.findAll({
            include: [
                {
                    model: Users, include: [{ model: UserDetail }],
                },
                { model: Room, include: [{ model: RoomType }] }],
            where: { status: "active" }
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
                deposit: element.deposit,
            });
        });


        return res.status(200).json({ data: data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getAllUserInRooms: RequestHandler = async (req, res) => {
    try {
        const month: any = req.params.month;
        const year: any = req.params.year;

        const userroomhave = await UserRoom.findAll({
            include: [
                { model: Users, include: [{ model: UserDetail }]},
                { model: Room, include: [{ model: RoomType }] },
                {
                    model: Invoice, include: [{ model: Payment }],
                    where: {
                        [Op.and]: [
                            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('invoice.date_invoice')), month),
                            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('invoice.date_invoice')), year)
                        ]
                    }
                }
            ],
            where: {
                status: "active",
            },
        });


        const userroomAll = await UserRoom.findAll({
            include: [
                { model: Users, include: [{ model: UserDetail }]},
                { model: Room, include: [{ model: RoomType }] },
                {
                    model: Invoice, include: [{ model: Payment }],
                }
            ],
            where: { status: "active" }
        });

        const data: object[] = [];

        userroomAll.forEach((e: any) => {
            const currentDate = new Date(year, month - 1, 1);
            const providedDate = new Date(e.date_in);
            
            const check = userroomhave.find((element: any) => element.iduser_room == e.iduser_room);
            
            if (check) {
                return;
            } else {
                if (dayjs(currentDate).format("MM/YYYY") >= dayjs(providedDate).format("MM/YYYY")) {
                    data.push({
                        iduser: e.users.iduser,
                        iduser_room: e.iduser_room,
                        fname: e.users.user_detail[0]?.fname,
                        lname: e.users.user_detail[0]?.lname,
                        room_number: e.room.room_number,
                        room_type_name: e.room.roomtype.room_type_name,
                        date_in: e.date_in,
                        date_out: e.date_out,
                        status: e.status,
                    });
                } else {
                    return;
                }
            }
            // if (!check) {
            //     if (e.date_in >= dayjs(`${year}-${month}-01`).format('YYYY-MM-DD HH:mm:ss')) {
            //         return;
            //     }
            //     else {
            //         data.push({
            //             iduser: e.users.iduser,
            //             iduser_room: e.iduser_room,
            //             fname: e.users.user_detail[0]?.fname,
            //             lname: e.users.user_detail[0]?.lname,
            //             room_number: e.room.room_number,
            //             room_type_name: e.room.roomtype.room_type_name,
            //             date_in: e.date_in,
            //             date_out: e.date_out,
            //             status: e.status,
            //         });
            //     }
            // }
        });

        return res.status(200).json({ data: data });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const createUserRoom: RequestHandler = async (req, res) => {
    let t:any = null;
    try {
        t = await UserRoom.sequelize?.transaction();
        const data: UserRoom = req.body;
        const userroom = await UserRoom.findOne({ where: { iduser: data.iduser, status: 'active' } });

        if (userroom) {
            return res.status(400).json({ message: 'ผู้ใช้นี้อยู่ในห้องอื่นแล้ว' });
        }

        const userroom2 = await UserRoom.findOne({ where: { idroom: data.idroom, status: 'active' } });

        if (userroom2) {
            return res.status(400).json({ message: 'ห้องนี้มีผู้ใช้แล้ว' });
        }

        const USERroom = await UserRoom.create({
            iduser: data.iduser,
            idroom: data.idroom,
            deposit: data.deposit,
            watermeterstart: data.watermeterstart,
            electricmeterstart: data.electricmeterstart,
            date_in: data.date_in,
            status: 'active'
        }, { transaction: t });

        await Room.update({
            room_status: 'full',
        }, { where: { idroom: data.idroom }, transaction: t });

        if (USERroom) {
            await t?.commit();
            return res.status(200).json({ message: 'การเช่าสำเร็จ' });
        } else {
            return res.status(400).json({ message: 'การเช่าไม่สำเร็จ' });
        }

    }
    catch (err: any) {
        if(t) await t?.rollback();
        res.status(500).json({ message: err.message });
    }
}

export const getRoomEmptyAndUsernotInRoom: RequestHandler = async (req, res) => {
    try {
        const room = await Room.findAll({
            include: [{ model: RoomType }],
            where: { room_status: "empty" }
        });

        const user = await Users.findAll({
            include: [{ model: UserDetail }],
        });

        const userroom = await UserRoom.findAll();


        const dataRoom: object[] = [];
        const data: object[] = [];

        room.forEach((element: any) => {
            dataRoom.push({
                idroom: element.idroom,
                room_number: element.room_number,
                room_type_name: element.roomtype.room_type_name,
            });
        });

        user.forEach((element: any) => {
            let check = true;
            userroom.forEach((element2: any) => {
                if (element.iduser == element2.iduser && element2.status == "active") {
                    check = false;
                }
            });
            if (check) {
                data.push({
                    iduser: element.iduser,
                    fname: element.user_detail[0]?.fname,
                    lname: element.user_detail[0]?.lname,
                });
            }
        });


        return res.status(200).json({ data: data, dataRoom: dataRoom });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}


