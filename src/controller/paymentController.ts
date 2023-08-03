import { RequestHandler } from 'express';
import { Payment } from '../models/paymentModel';
import { Invoice } from '../models/invoiceModel';
import { Users } from '../models/userModel';
import { UserDetail } from '../models/userdetailModel';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { PaymentType } from '../models/paymentTypeModel';
import { Op, where } from 'sequelize';
import { UserRoom } from '../models/user_roomModel';
import multer, { Multer } from 'multer';

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
        const data: Payment = req.body;
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
        const data = []
        const users = await Users.findAll({
            include: [
                { model: UserDetail, attributes: ['fname', 'lname'] },
                { model: UserRoom, attributes: ['idroom'], where: { status: 'active' } },
                { model: Invoice, required: true, order: [['createdAt', 'DESC']], include: [{ model: Payment, required: false, attributes: ['payment_status', 'updatedAt'] }] }
            ],
            where: { iduser: req.body.user.id }
        })

        if (users.length == 0) {
            return res.status(404).json({ message: 'ไม่มีข้อมูลใบแจ้งหนี้' });
        }

        for (let i = 0; i < users.length; i++) {
            data.push({
                idinvoice: users[i].invoice[0].idinvoice,
                idroom: users[i].user_room[0].idroom,
                fname: users[i].user_detail[0].fname,
                lname: users[i].user_detail[0].lname,
                date_invoice: users[i].invoice[0].createdAt,
                payment_status: users[i].invoice[0].payment[0]?.payment_status,
                updatedAt: users[i].invoice[0].payment[0]?.updatedAt,
                total: (
                    users[i].invoice[0].room_price +
                    (users[i].invoice[0].watermeter_new - users[i].invoice[0].watermeter_old) * users[i].invoice[0].water_price +
                    (users[i].invoice[0].electricmeter_new - users[i].invoice[0].electricmeter_old) * users[i].invoice[0].electric_price
                )
            })
        }

        return res.status(200).json({ data: data });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const updatePaymentByidinvoiceAndUploadfile: RequestHandler = async (req, res) => {
    const t = await Payment.sequelize?.transaction();
    const iduser = req.body.user.id;
    try {
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
                payment: data.payment,
                note: data.note,
                image_payment: dateStr + '-' + iduser + "." + mimetype
            }, { where: { idinvoice: req.params.id }, transaction: t  });
            if (payment) {
                await t?.commit();
                return res.status(200).json({ message: 'ชำระเงินสำเร็จ' });
            } else {
                await t?.rollback();
                return res.status(400).json({ message: 'ชำระเงินไม่สำเร็จ' });
            }
        })

    } catch (err: any) {
        await t?.rollback();
        return res.status(500).json({ message: err.message });
    }
}
