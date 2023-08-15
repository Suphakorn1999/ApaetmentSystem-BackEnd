import { RequestHandler } from 'express';
import { Users } from '../models/userModel';
import { Room } from '../models/roomModel';
import { Report } from '../models/reportModel';
import { Op } from 'sequelize';
import { Payment } from '../models/paymentModel';
import { Invoice } from '../models/invoiceModel';
import { Sequelize } from 'sequelize-typescript';

export const getCountAll: RequestHandler = async (req, res) => {
    try {
        const roomtype1emptycount = await Room.count({ where: { [Op.and]: [{ status_room: 'active' }, { room_status: 'empty' }, { idroom_type: 1 }] } });
        const roomtype2emptycount = await Room.count({ where: { [Op.and]: [{ status_room: 'active' }, { room_status: 'empty' }, { idroom_type: 2 }] } });
        const roomtype1fullcount = await Room.count({ where: { [Op.and]: [{ status_room: 'active' }, { room_status: 'full' }, { idroom_type: 1 }] } });
        const roomtype2fullcount = await Room.count({ where: { [Op.and]: [{ status_room: 'active' }, { room_status: 'full' }, { idroom_type: 2 }] } });
        const countReport = await Report.count({ where: { [Op.or]: [{ report_status: "pending" }, { report_status: "inprogress" }] } });

        return res.status(200).json({ countRoomEmptyType1: roomtype1emptycount, countRoomEmptyType2: roomtype2emptycount, countRoomFullType1: roomtype1fullcount, countRoomFullType2: roomtype2fullcount, countReport: countReport });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getmonthlyincome = async (req: any, res: any) => {
    try {
        const { year } = req.query;
        const monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        const monthlyIncome = await Payment.calculateMonthlyIncome(year);

        const barChartData = monthlyIncome.map((income, index) => {
            return {
                เดือน: monthNames[index],
                รายได้: income
            }
        });

        return res.status(200).json({ data: barChartData });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getCountBadge = async (req: any, res: any) => {
    try {
        const countReport = await Report.count({ where: { [Op.or]: [{ report_status: "pending" }, { report_status: "inprogress" }] } });
        const countInvoice = await Invoice.count({ include: [{ model: Payment, where: { payment_status: "pending" } }] });
        
        return res.status(200).json({ countReport: countReport, countInvoice: countInvoice });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}