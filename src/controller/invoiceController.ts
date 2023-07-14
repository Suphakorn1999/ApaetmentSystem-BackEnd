import { RequestHandler } from 'express';
import { Invoice } from '../models/invoiceModel';
import { Users } from '../models/userModel';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { UserDetail } from '../models/userdetailModel';
import { Op } from 'sequelize';

export const getallInvoices: RequestHandler = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({ include: [{ model: Users, attributes: { exclude: ['password'] } }, { model: Room }] });
        res.status(200).json({ data: invoices });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getInvoiceByid: RequestHandler = async (req, res) => {
    try {
        let data = []
        const userDetail = await UserDetail.findOne({ where: { iduser: req.params.id },attributes: ['iduser',"fname","lname","idroom"] });
        if (userDetail){
            const room = await Room.findOne({ where: { idroom: userDetail.idroom }, include: [{ model: RoomType, attributes: ["room_price", "WaterMeterprice","ElectricMeterprice"] }] });
            if (room) {
                const invoice = await Invoice.findAll({ where: { iduser: req.params.id } });
                if (invoice.length == 0) {
                    data.push({
                        iduser: userDetail.iduser,
                        fname: userDetail.fname,
                        lname: userDetail.lname,
                        idroom: userDetail.idroom,
                        room_price: parseInt(room.roomtype.room_price),
                        electric_price: parseInt(room.roomtype.ElectricMeterprice),
                        water_price: parseInt(room.roomtype.WaterMeterprice),
                        watermeter_old: 0,
                        electricmeter_old: 0,
                    })
                    return res.status(200).json({ data: data[0] });
                }else{
                    const invoice = await Invoice.findOne({ where: { iduser: req.params.id }, order: [['createdAt', 'DESC']] });
                    if (invoice) {
                        data.push({
                            iduser: invoice.iduser,
                            fname: userDetail.fname,
                            lname: userDetail.lname,
                            idroom: userDetail.idroom,
                            room_price: parseInt(room.roomtype.room_price),
                            electric_price: parseInt(room.roomtype.ElectricMeterprice),
                            water_price: parseInt(room.roomtype.WaterMeterprice),
                            watermeter_old: invoice.watermeter_new,
                            electricmeter_old: invoice.electricmeter_new,
                        })
                        return res.status(200).json({ data: data[0] });
                    }    
                }
            }else{
                return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
            }
        }else{
            return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const createInvoice: RequestHandler = async (req, res) => {
    try {
        const data : Invoice = req.body;

        const invoice = await Invoice.create({
            iduser: data.iduser,
            room_price: data.room_price,
            watermeter_old: data.watermeter_old,
            watermeter_new: data.watermeter_new,
            electricmeter_old: data.electricmeter_old,
            electricmeter_new: data.electricmeter_new,
            electric_price: data.electric_price,
            water_price: data.water_price,
        });
        return res.status(200).json({ message: 'สร้างใบแจ้งหนี้สำเร็จ' });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}