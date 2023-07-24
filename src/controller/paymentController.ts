import { RequestHandler } from 'express';
import { Payment } from '../models/paymentModel';
import { Invoice } from '../models/invoiceModel';
import { Users } from '../models/userModel';
import { UserDetail } from '../models/userdetailModel';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { PaymentType } from '../models/paymentTypeModel';
import { Op } from 'sequelize';

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
