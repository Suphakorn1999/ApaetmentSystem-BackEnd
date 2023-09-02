import { RequestHandler } from 'express';
import { Invoice } from '../models/invoiceModel';
import { Users } from '../models/userModel';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { UserDetail } from '../models/userdetailModel';
import { UserRoom } from '../models/user_roomModel';
import { Op } from 'sequelize';
import { Payment } from '../models/paymentModel';

export const getallInvoices: RequestHandler = async (req, res) => {
    try {
        const data: object[] = []

        const invoices = await Invoice.findAll({
            include: [
                { model: Payment },
                {
                    model: UserRoom,
                    attributes: ['idroom'],
                    where: { [Op.or]: [{ status: 'active' }, { status: 'inactive' }] },
                    include: [
                        { model: Room, attributes: ['room_number'] },
                        {
                            model: Users, attributes: ['iduser'], where: { idrole: { [Op.ne]: 1 } },
                            include: [{
                                model:
                                    UserDetail, attributes: ['fname', 'lname']
                            }]
                        }
                    ]
                },
            ],
            order: [['createdAt', 'DESC']]
        });

        if (invoices.length == 0) {
            return res.status(200).json({ data: [] });
        }

        invoices.forEach((invoice) => {
            data.push({
                idinvoice: invoice.idinvoice,
                idroom: invoice.user_room.idroom,
                fname: invoice.user_room.users.user_detail[0]?.fname,
                lname: invoice.user_room.users.user_detail[0]?.lname,
                room_number: invoice.user_room.room.room_number,
                date_invoice: invoice.createdAt,
                payment_status: invoice.payment[0]?.payment_status,
                updatedAt: invoice.payment[0]?.updatedAt,
                total: (
                    invoice.room_price +
                    (invoice.watermeter_new - invoice.watermeter_old) * invoice.water_price +
                    (invoice.electricmeter_new - invoice.electricmeter_old) * invoice.electric_price
                )
            })
        })


        return res.status(200).json({ data: data });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getInvoiceByid: RequestHandler = async (req, res) => {
    try {
        let data: object[] = []

        const userroom = await UserRoom.findOne({
            where: { iduser_room: req.params.id },
            include: [
                { model: Users, attributes: ['iduser'], include: [{ model: UserDetail, attributes: ['fname', 'lname'] }] },
                { model: Room, attributes: ['idroom', 'room_number'], include: [{ model: RoomType, attributes: ['room_price', 'WaterMeterprice', 'ElectricMeterprice'] }] },
            ]
        });

        if (userroom) {
            const invoice = await Invoice.findOne({
                where: { iduser_room: req.params.id },
                include: [{ model: Payment }],
                order: [['createdAt', 'DESC']]
            });

            if (invoice) {
                data.push({
                    iduser: userroom.users.iduser,
                    fname: userroom.users.user_detail[0]?.fname,
                    lname: userroom.users.user_detail[0]?.lname,
                    room_number: userroom.room.room_number,
                    room_price: userroom.room.roomtype.room_price,
                    watermeter_old: invoice.watermeter_old,
                    electricmeter_old: invoice.electricmeter_old,
                    water_price: userroom.room.roomtype.WaterMeterprice,
                    electric_price: userroom.room.roomtype.ElectricMeterprice,
                })
                return res.status(200).json({ data: data[0] });
            } else {
                data.push({
                    iduser: userroom.users.iduser,
                    fname: userroom.users.user_detail[0]?.fname,
                    lname: userroom.users.user_detail[0]?.lname,
                    room_number: userroom.room.room_number,
                    room_price: userroom.room.roomtype.room_price,
                    watermeter_old: userroom.watermeterstart,
                    electricmeter_old: userroom.electricmeterstart,
                    water_price: userroom.room.roomtype.WaterMeterprice,
                    electric_price: userroom.room.roomtype.ElectricMeterprice,
                })

                return res.status(200).json({ data: data[0] });
            }
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const createInvoice: RequestHandler = async (req, res) => {
    const t = await Invoice.sequelize?.transaction();
    try {
        const data: Invoice = req.body;
        const userroom = await UserRoom.findOne({
            where: { iduser: req.body.iduser, status: 'active' },
        });

        if (userroom) {
            const invoice = await Invoice.create({
                iduser_room: userroom.iduser_room,
                room_price: data.room_price,
                watermeter_old: data.watermeter_old,
                watermeter_new: data.watermeter_new,
                electricmeter_old: data.electricmeter_old,
                electricmeter_new: data.electricmeter_new,
                electric_price: data.electric_price,
                water_price: data.water_price,
            }, { transaction: t });

            await Payment.create({
                idinvoice: invoice.idinvoice,
            }, { transaction: t })

            await t?.commit();
            return res.status(200).json({ message: 'สร้างใบแจ้งหนี้สำเร็จ' });
        } else {
            return res.status(404).json({ message: 'ไม่พบข้อมูลผู้เช่า' });
        }
    } catch (err: any) {
        await t?.rollback();
        return res.status(500).json({ message: err.message });
    }
}

export const getInvoiceByidInvoice: RequestHandler = async (req, res) => {
    try {
        const data = []
        const invoice = await Invoice.findOne({
            where: {
                idinvoice: req.params.id
            },
            include: [{
                model: Payment
            },
            {
                model: UserRoom,
                include: [{
                    model: Room,
                    include: [{
                        model: RoomType
                    }]
                },
                {
                    model: Users,
                    include: [{
                        model: UserDetail
                    }]
                }
                ]
            }
            ]
        });
        if (invoice) {
            data.push({
                idinvoice: invoice.idinvoice,
                idroom: invoice.user_room.idroom,
                fname: invoice.user_room.users.user_detail[0]?.fname,
                lname: invoice.user_room.users.user_detail[0]?.lname,
                room_price: invoice.room_price,
                watermeter_old: invoice.watermeter_old,
                watermeter_new: invoice.watermeter_new,
                electricmeter_old: invoice.electricmeter_old,
                electricmeter_new: invoice.electricmeter_new,
                water_price: invoice.water_price,
                electric_price: invoice.electric_price,
                date_invoice: invoice.createdAt,
                fname_payee: invoice.payment[0]?.fname_payee,
                lname_payee: invoice.payment[0]?.lname_payee,
            })
            return res.status(200).json({ data: data[0] });
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getInvoiceMonthlyByToken: RequestHandler = async (req, res) => {
    try {
        const data = []
        const users = await Users.findOne({ where: { iduser: req.body.user.id }, attributes: ['iduser'] });
        if (users) {
            const invoice = await Invoice.findAll({
                include: [{
                    model: Payment,
                    where: {
                        [Op.or]:
                            [{ payment_status: 'pending' }, { payment_status: "unpaid" }]
                    }
                },
                {
                    model: UserRoom,
                    where: { status: 'active' },
                    include: [{
                        model: Users,
                        where: { iduser: users.iduser },
                    }]
                }
                ]
            });
            if (invoice.length == 0) {
                return res.status(200).json({ data: [] });
            }
            for (let i = 0; i < invoice.length; i++) {
                data.push({
                    total: (
                        invoice[i].room_price +
                        (invoice[i].watermeter_new - invoice[i].watermeter_old) * invoice[i].water_price +
                        (invoice[i].electricmeter_new - invoice[i].electricmeter_old) * invoice[i].electric_price
                    ),
                })
            }
            return res.status(200).json({ data: data[0] });
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getAllInvoiceByToken: RequestHandler = async (req, res) => {
    try {
        const data = []
        const users = await Users.findOne({ where: { iduser: req.body.user.id }, attributes: ['iduser'] });
        if (users) {
            const invoice = await Invoice.findAll({
                include: [{
                    model: Payment,
                    where: { payment_status: 'paid' }
                }, {
                    model: UserRoom,
                    where: { status: 'active' },
                    include: [{
                        model: Users,
                        where: { iduser: users.iduser },
                    }]
                }
                ], limit: 5, order: [['createdAt', 'DESC']]
            });
            if (invoice.length == 0) {
                return res.status(200).json({ data: [] });
            }
            for (let i = 0; i < invoice.length; i++) {
                data.push({
                    payment_status: invoice[i].payment[0]?.payment_status,
                    total: (
                        invoice[i].room_price +
                        (invoice[i].watermeter_new - invoice[i].watermeter_old) * invoice[i].water_price +
                        (invoice[i].electricmeter_new - invoice[i].electricmeter_old) * invoice[i].electric_price
                    ),
                    updatedAt: invoice[i].payment[0]?.updatedAt,
                })
            }
            return res.status(200).json({ data: data });
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getAllInvoiceMonthly: RequestHandler = async (req, res) => {
    try {
        const data: object[] = []
        const month: any = req.params.month;
        const users = await Users.findAll({
            include: [
                {
                    model: UserRoom, attributes: ['idroom'], where: { status: 'active' },
                    include: [{
                        model: Room, attributes: ['room_number'],
                        include: [{
                            model: RoomType
                        }], order: [['room_number', 'DESC']], required: true
                    },
                    { model: Invoice, required: true, include: [{ model: Payment, required: false, attributes: ['payment_status', 'updatedAt', "fname_payee", "lname_payee"] }], where: { [Op.and]: [{ createdAt: { [Op.gte]: new Date(new Date().getFullYear(), month - 1, 1) } }, { createdAt: { [Op.lte]: new Date(new Date().getFullYear(), month, 0) } }] } }
                    ]
                },
                { model: UserDetail, attributes: ['fname', 'lname'] },
            ],
            where: { idrole: { [Op.ne]: 1 } }
        })

        if (users.length == 0) {
            return res.status(200).json({ data: [] });
        }

        users.forEach((user) => {
            data.push({
                room_number: user.user_room[0]?.room.room_number,
                username: user.username,
                fname: user.user_detail[0]?.fname,
                lname: user.user_detail[0]?.lname,
                room_price: parseInt(user.user_room[0]?.room.roomtype.room_price),
                watermeter_old: user.user_room[0]?.invoice[0]?.watermeter_old,
                watermeter_new: user.user_room[0]?.invoice[0]?.watermeter_new,
                electricmeter_old: user.user_room[0]?.invoice[0]?.electricmeter_old,
                electricmeter_new: user.user_room[0]?.invoice[0]?.electricmeter_new,
                water_price: user.user_room[0]?.invoice[0]?.water_price,
                electric_price: user.user_room[0]?.invoice[0]?.electric_price,
                total: (
                    user.user_room[0]?.invoice[0]?.room_price +
                    (user.user_room[0]?.invoice[0]?.watermeter_new - user.user_room[0]?.invoice[0]?.watermeter_old) * user.user_room[0]?.invoice[0]?.water_price +
                    (user.user_room[0]?.invoice[0]?.electricmeter_new - user.user_room[0]?.invoice[0]?.electricmeter_old) * user.user_room[0]?.invoice[0]?.electric_price
                ),
                payment_status: user.user_room[0]?.invoice[0]?.payment[0]?.payment_status,
                updatedAt: user.user_room[0]?.invoice[0]?.payment[0]?.updatedAt,
            })
        })

        data.sort((a: any, b: any) => {
            return parseInt(a.room_number) - parseInt(b.room_number);
        })


        return res.status(200).json({ data: data });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}