import { Invoice } from './../models/invoiceModel';
import { RequestHandler } from 'express';
import { Payment } from '../models/paymentModel';
import { Users } from '../models/userModel';
import { UserDetail } from '../models/userdetailModel';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { PaymentType } from '../models/paymentTypeModel';
import { Op, where } from 'sequelize';
import { UserRoom } from '../models/user_roomModel';
import multer, { Multer } from 'multer';
import { Payee } from '../models/payeeModel';
import fs from 'fs';

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
        const payment = await Payment.findAll({ where: { idinvoice: req.params.id }, include: [{ model: PaymentType }] });
        const data: Object[] = [];
        if (payment.length == 0) {
            return res.status(404).json({ message: 'ไม่มีประวัติการชำระเงิน' });
        }
        payment.forEach((pay) => {
            data.push({
                idpayment: pay.idpayment,
                idpayment_type: pay.idpayment_type,
                payment_status: pay.payment_status,
                note: pay.note,
                idpayee: pay.idpayee,
                image_payment: pay.image_payment,
                payment_type: pay.paymenttype?.payment_type,
            })
        })

        return res.status(200).json({ data: data });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const updatePaymentByidinvoice: RequestHandler = async (req, res) => {
    try {
        const data: Payment = req.body;
        const payment = await Payment.update({
            idinvoice: data.idinvoice,
            idpayment_type: data.idpayment_type,
            payment_status: data.payment_status,
            note: data.note,
            idpayee: data.idpayee
        }, { where: { idinvoice: req.params.id } });
        if (payment) {
            return res.status(200).json({ message: 'อัปเดตชำระเงินสำเร็จ' });
        } else {
            return res.status(400).json({ message: 'ชำระเงินไม่สำเร็จ' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getPaymentByTokenUser: RequestHandler = async (req, res) => {
    try {
        const data: Object[] = []

        const invoice = await Invoice.findAll({
            include: [
                { model: Payment, required: false, attributes: ['payment_status', 'updatedAt'] },
                {
                    model: UserRoom, attributes: ['idroom'], where: { status: 'active' },
                    include: [
                        { model: Users, attributes: ['iduser'], where: { iduser: req.body.user.id }, include: [{ model: UserDetail, attributes: ['fname', 'lname'] }] },
                        { model: Room, attributes: ['room_number'] }
                    ]
                },
            ],
        })

        if (invoice.length == 0) {
            return res.status(200).json({ data: [] });
        }

        invoice.forEach((inv) => {
            data.push({
                idinvoice: inv.idinvoice,
                room_number: inv.user_room?.room.room_number,
                fname: inv.user_room?.users?.user_detail[0]?.fname,
                lname: inv.user_room?.users?.user_detail[0]?.lname,
                date_invoice: inv.createdAt,
                payment_status: inv.payment[0]?.payment_status,
                updatedAt: inv.payment[0]?.updatedAt,
                total: (
                    inv.room_price +
                    (inv.watermeter_new - inv.watermeter_old) * inv.water_price +
                    (inv.electricmeter_new - inv.electricmeter_old) * inv.electric_price
                )
            })
        })

        data.sort((a: any, b: any) => { return b.idinvoice - a.idinvoice })

        return res.status(200).json({ data: data });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const updatePaymentByidinvoiceAndUploadfile: RequestHandler = async (req, res) => {
    let t: any = null;
    try {
        t = await Payment.sequelize?.transaction();
        const iduser = req.body.user.id;
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public/uploads/payment')
            },
            filename: function (req, file, cb) {
                const date = new Date();
                const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                const mimetype = file.mimetype.split('/')[1];
                cb(null, dateStr + '-' + iduser + "." + mimetype)
            }
        })

        const upload = multer({ storage: storage }).single('file')

        upload(req, res, async function (err: any) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json({ message: err.message });
            }
            else if (err) {
                return res.status(500).json({ message: err.message });
            }
            const date = new Date();
            const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            const data: Payment = req.body;
            
            const mimetype = req.file?.mimetype.split('/')[1];
            const payment = await Payment.update({
                idinvoice: data.idinvoice,
                idpayment_type: Number(data.idpayment_type),
                note: data.note,
                image_payment: dateStr + '-' + iduser + "." + mimetype
            }, { where: { idinvoice: req.params.id }, transaction: t });
            if (payment) {
                await t?.commit();
                return res.status(200).json({ message: 'ชำระเงินสำเร็จ' });
            } else {
                await t?.rollback();
                return res.status(400).json({ message: 'ชำระเงินไม่สำเร็จ' });
            }
        })

    } catch (err: any) {
        if(t) await t?.rollback();
        return res.status(500).json({ message: err.message });
    }
}

export const getAllpayee: RequestHandler = async (req, res) => {
    try {
        const payee = await Payee.findAll();
        if (payee.length == 0) {
            return res.status(404).json({ message: 'ไม่มีผู้รับเงิน' });
        }
        return res.status(200).json({ data: payee });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createPayee: RequestHandler = async (req, res) => {
    try {
        const { fname_payee, lname_payee } = req.body;
        const payee = await Payee.findOne({ where: { fname_payee: fname_payee, lname_payee: lname_payee } });
        if (payee) {
            return res.status(400).json({ message: 'ผู้รับเงินนี้มีอยู่แล้ว' });
        } else {
            const payee = await Payee.create({ fname_payee: fname_payee, lname_payee: lname_payee });
            return res.status(200).json({ message: 'เพิ่มผู้รับเงินสำเร็จ' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const updatePayee: RequestHandler = async (req, res) => {
    try {
        const { fname_payee, lname_payee } = req.body;
        const payee = await Payee.update({ fname_payee: fname_payee, lname_payee: lname_payee }, { where: { idpayee: req.params.id } });
        if (payee) {
            return res.status(200).json({ message: 'แก้ไขผู้รับเงินสำเร็จ' });
        } else {
            return res.status(400).json({ message: 'แก้ไขผู้รับเงินไม่สำเร็จ' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getpayeeByid: RequestHandler = async (req, res) => {
    try {
        const payee = await Payee.findOne({ where: { idpayee: req.params.id } });
        if (!payee) {
            return res.status(404).json({ message: 'ไม่มีผู้รับเงิน' });
        }

        return res.status(200).json({ data: payee });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const deleteimagepayment: RequestHandler = async (req, res) => {
    let t: any = null;
    try {
        t = await Payment.sequelize?.transaction();
        const image_payment = req.params.image_payment;
        const idpayment = req.params.idpayment;

        const payment = await Payment.update({ image_payment: null, payment: null, idpayee: null }, { where: { idpayment: idpayment }, transaction: t });
        if (payment) {
            fs.unlinkSync('./public/uploads/payment/' + image_payment);
            await t?.commit();
            return res.status(200).json({ message: 'ลบรูปภาพสำเร็จ' });
        } else {
            return res.status(400).json({ message: 'ลบรูปภาพไม่สำเร็จ' });
        }
    } catch (err: any) {
        if(t) await t?.rollback();
        return res.status(500).json({ message: err.message });
    }
}