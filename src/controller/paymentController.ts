import { RequestHandler } from 'express';
import { Payment } from '../models/paymentModel';
import { Invoice } from '../models/invoiceModel';
import { Users } from '../models/userModel';
import { UserDetail } from '../models/userdetailModel';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { PaymentType } from '../models/paymentTypeModel';
import { Op, where } from 'sequelize';

export const createPaymentType: RequestHandler = async (req, res) => {
    try {
        const { payment_type } = req.body;
        const paymentType = await PaymentType.findOne({ where: { payment_type: payment_type } });
        if (paymentType) {
            return res.status(400).json({ message: 'ประเภทการชำระเงินนี้มีอยู่แล้ว' });
        } else {
            const paymentType = await PaymentType.create({ payment_type: payment_type });
            return res.status(200).json({ message: 'เพิ่มประเภทการชำระเงินสำเร็จ' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getallPaymentType: RequestHandler = async (req, res) => {
    try {
        const paymentType = await PaymentType.findAll();
        if (paymentType.length == 0) {
            return res.status(404).json({ message: 'ไม่มีประเภทการชำระเงิน' });
        }
        return res.status(200).json({ data: paymentType });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getPaymentByidinvoice: RequestHandler = async (req, res) => {
    try {
        const payment = await Payment.findAll({ where: { idinvoice: req.params.id } });
        if (payment.length == 0) {
            return res.status(404).json({ message: 'ไม่มีประวัติการชำระเงิน' });
        }
        return res.status(200).json({ data: payment });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const updatePaymentByidinvoice: RequestHandler = async (req, res) => {
    try {
        const data:Payment = req.body;
        const payment = await Payment.update({
            idinvoice: data.idinvoice,
            payment: data.payment,
            payment_status: data.payment_status,
            note: data.note,
            fname_payee: data.fname_payee,
            lname_payee: data.lname_payee,
        }, { where: { idinvoice: req.params.id } });
        if (payment) {
            return res.status(200).json({ message: 'ชำระเงินสำเร็จ' });
        } else {
            return res.status(400).json({ message: 'ชำระเงินไม่สำเร็จ' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getPaymentByTokenUser: RequestHandler = async (req, res) => {
    try {
        const user = await Users.findOne({ where: { iduser: req.body.user.id } });
        if (user) {
            const payment = await Invoice.findAll({ where: { iduser: user.iduser }, include: [{ model: Payment, required: false, attributes: ['payment_status'] }] });
            if (payment.length == 0) {
                return res.status(404).json({ message: 'ไม่มีประวัติการชำระเงิน' });
            }
            return res.status(200).json({ data: payment });
        }else{
            return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

