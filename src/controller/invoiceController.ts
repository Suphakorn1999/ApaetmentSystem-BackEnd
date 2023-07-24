import { RequestHandler } from 'express';
import { Invoice } from '../models/invoiceModel';
import { Users } from '../models/userModel';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { UserDetail } from '../models/userdetailModel';
import { UserRoom } from '../models/user_roomModel';
import { Op } from 'sequelize';

export const getallInvoices: RequestHandler = async (req, res) => {
    try {
        const data = []
        const invoices = await Invoice.findAll({ include: [{ model: Users, include: [{ model: UserDetail, attributes: ['fname', 'lname'] }, { model: UserRoom, attributes: ['idroom'] }], attributes: ['iduser'] }] });

        if (invoices.length == 0) {
            return res.status(404).json({ message: 'ไม่มีข้อมูลใบแจ้งหนี้' });
        }

        for (let i = 0; i < invoices.length; i++) {
            data.push({
                idinvoice: invoices[i].idinvoice,
                idroom: invoices[i].user.user_room[0].idroom,
                fname: invoices[i].user.user_detail[0].fname,
                lname: invoices[i].user.user_detail[0].lname,
                date_invoice: invoices[i].createdAt,
                total: (invoices[i].room_price + (invoices[i].watermeter_new - invoices[i].watermeter_old) * invoices[i].water_price + (invoices[i].electricmeter_new - invoices[i].electricmeter_old) * invoices[i].electric_price)
            })
        }
        return res.status(200).json({ data: data });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getInvoiceByid: RequestHandler = async (req, res) => {
    try {
        let data = []
        const userDetail = await UserDetail.findOne({ where: { iduser: req.params.id }, attributes: ['iduser', "fname", "lname"], include: [{ model: Users, include: [{ model: UserRoom, attributes: ['idroom'] }] }] });
        if (userDetail) {
            const room = await Room.findOne({ where: { idroom: userDetail.users.user_room[0].idroom }, include: [{ model: RoomType, attributes: ["room_price", "WaterMeterprice", "ElectricMeterprice"] }] });
            if (room) {
                const invoice = await Invoice.findAll({ where: { iduser: req.params.id } });
                if (invoice.length == 0) {
                    data.push({
                        iduser: userDetail.iduser,
                        fname: userDetail.fname,
                        lname: userDetail.lname,
                        idroom: userDetail.users.user_room[0].idroom,
                        room_price: parseInt(room.roomtype.room_price),
                        electric_price: parseInt(room.roomtype.ElectricMeterprice),
                        water_price: parseInt(room.roomtype.WaterMeterprice),
                        watermeter_old: 0,
                        electricmeter_old: 0,
                    })
                    return res.status(200).json({ data: data[0] });
                } else {
                    const invoice = await Invoice.findOne({ where: { iduser: req.params.id }, order: [['createdAt', 'DESC']] });
                    if (invoice) {
                        data.push({
                            iduser: invoice.iduser,
                            fname: userDetail.fname,
                            lname: userDetail.lname,
                            idroom: userDetail.users.user_room[0].idroom,
                            room_price: parseInt(room.roomtype.room_price),
                            electric_price: parseInt(room.roomtype.ElectricMeterprice),
                            water_price: parseInt(room.roomtype.WaterMeterprice),
                            watermeter_old: invoice.watermeter_new,
                            electricmeter_old: invoice.electricmeter_new,
                        })
                        return res.status(200).json({ data: data[0] });
                    }
                }
            } else {
                return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
            }
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const createInvoice: RequestHandler = async (req, res) => {
    try {
        const data: Invoice = req.body;

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

export const getInvoiceByidInvoice: RequestHandler = async (req, res) => {
    try {
        const data = []
        const invoice = await Invoice.findOne({ where: { idinvoice: req.params.id }, include: [{ model: Users, include: [{ model: UserDetail, attributes: ['fname', 'lname'] }, { model: UserRoom, attributes: ['idroom'], where: { status: 'active' } }], attributes: ['iduser'] }] });
        if (invoice) {
            data.push({
                idinvoice: invoice.idinvoice,
                idroom: invoice.user.user_room[0].idroom,
                fname: invoice.user.user_detail[0].fname,
                lname: invoice.user.user_detail[0].lname,
                room_price: invoice.room_price,
                watermeter_old: invoice.watermeter_old,
                watermeter_new: invoice.watermeter_new,
                electricmeter_old: invoice.electricmeter_old,
                electricmeter_new: invoice.electricmeter_new,
                water_price: invoice.water_price,
                electric_price: invoice.electric_price,
                date_invoice: invoice.createdAt,
            })
            return res.status(200).json({ data: data[0] });
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}