import { RequestHandler } from 'express';
import nodemailer from 'nodemailer';
import { EmailTemplate } from '../templates/EmailTemplate';
import dotenv from 'dotenv';
import { Invoice } from '../models/invoiceModel';
import { Payment } from '../models/paymentModel';
import { Users } from '../models/userModel';
import { UserDetail } from '../models/userdetailModel';
import { UserRoom } from '../models/user_roomModel';
import { Room } from '../models/roomModel';
dotenv.config();

export const sendMail: RequestHandler = async (req, res, next) => {
    try {
        const data = []
        
        const invoice = await Invoice.findOne({
            where: { idinvoice: req.params.id },
            include: [
                { model: Payment },
                {
                    model: UserRoom, attributes: ['idroom'], where: { status: 'active' },
                    include: [
                        { model: Room },
                        { model: Users, include: [{ model: UserDetail, attributes: ['fname', 'lname', 'email'] }], attributes: ['iduser'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        if (invoice?.user_room.users.user_detail[0]?.email === null) {
            res.status(500).json({ message: 'ไม่สามารถส่งอีเมล์ได้ เนื่องจากผู้เช่าไม่มีอีเมล์' });
        }
        if (invoice) {
            data.push({
                idinvoice: invoice.idinvoice,
                room_number: invoice.user_room.room.room_number,
                fname: invoice.user_room.users.user_detail[0]?.fname,
                lname: invoice.user_room.users.user_detail[0]?.lname,
                room_price: invoice.room_price,
                watermeter_old: invoice.watermeter_old,
                watermeter_new: invoice.watermeter_new,
                electricmeter_old: invoice.electricmeter_old,
                electricmeter_new: invoice.electricmeter_new,
                water_price: invoice.water_price,
                electric_price: invoice.electric_price,
                waterPrice: (invoice.watermeter_new - invoice.watermeter_old) * invoice.water_price,
                electricPrice: (invoice.electricmeter_new - invoice.electricmeter_old) * invoice.electric_price,
                totalPrice: (
                    invoice.room_price +
                    ((invoice.watermeter_new - invoice.watermeter_old) * invoice.water_price) +
                    ((invoice.electricmeter_new - invoice.electricmeter_old) * invoice.electric_price)
                ),
                email: invoice.user_room.users.user_detail[0]?.email,
                createAt: invoice.createdAt,
            })
        }
        const emailTemplate = EmailTemplate(data[0])

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_SENDER,
            to: data[0]?.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
        });


        res.status(200).json({ message: 'ส่งอีเมล์สำเร็จ' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'ส่งอีเมล์ไม่สำเร็จ' });
    }
};
