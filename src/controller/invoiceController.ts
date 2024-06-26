import e, { RequestHandler } from 'express';
import { Invoice } from '../models/invoiceModel';
import { Users } from '../models/userModel';
import { Room } from '../models/roomModel';
import { RoomType } from '../models/roomtypeModel';
import { UserDetail } from '../models/userdetailModel';
import { UserRoom } from '../models/user_roomModel';
import { Op } from 'sequelize';
import { Payment } from '../models/paymentModel';
import { Payee } from '../models/payeeModel';
import dayjs from 'dayjs';

export const getallInvoices: RequestHandler = async (req, res) => {
    try {
        const data: object[] = []
        const month: any = req.params.month;
        const year: any = req.params.year;

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
                            model: Users, attributes: ['iduser'],
                            include: [{
                                model:
                                    UserDetail, attributes: ['fname', 'lname']
                            }]
                        }
                    ]
                },
            ],
            order: [['date_invoice', 'DESC']],
            where: { date_invoice: { [Op.between]: [new Date(year, month - 1, 1), new Date(year, month, 0)] } }
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
                date_invoice: invoice.date_invoice,
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
        const iduser_room = req.params.id;
        const month: any = req.params.month || new Date().getMonth() + 1;
        const year: any = req.params.year || new Date().getFullYear();

        const userroom = await UserRoom.findOne({
            where: { iduser_room: iduser_room },
            include: [
                { model: Users, attributes: ['iduser'], include: [{ model: UserDetail, attributes: ['fname', 'lname'] }] },
                { model: Room, attributes: ['idroom', 'room_number'], include: [{ model: RoomType, attributes: ['room_price', 'WaterMeterprice', 'ElectricMeterprice'] }] },
            ]
        });

        if (userroom) {
            const invoice = await Invoice.findOne({
                where: {
                    iduser_room: iduser_room,
                    date_invoice: { [Op.between]: [new Date(year, month - 2, 1), new Date(year, month, 0)] }
                },
                include: [{ model: Payment }],
                order: [['idinvoice', 'DESC']]
            });

            if (invoice?.payment[0]?.payment_status == 'pending' || invoice?.payment[0]?.payment_status == 'unpaid') {
                return res.status(400).json({ message: 'ยังมีบิลที่ยังไม่ชำระ' });
            }

            if (invoice) {
                data.push({
                    iduser: userroom.users.iduser,
                    fname: userroom.users.user_detail[0]?.fname,
                    lname: userroom.users.user_detail[0]?.lname,
                    room_number: userroom.room.room_number,
                    room_price: userroom.room.roomtype.room_price,
                    watermeter_old: invoice.watermeter_new,
                    electricmeter_old: invoice.electricmeter_new,
                    water_price: userroom.room.roomtype.WaterMeterprice,
                    electric_price: userroom.room.roomtype.ElectricMeterprice,
                })
                return res.status(200).json({ data: data[0] });
            } else {
                const check = await Invoice.findOne({
                    where: { iduser_room: iduser_room },
                    include: [{ model: Payment }],
                    order: [['idinvoice', 'DESC']]
                });

                if (check) {
                    return res.status(400).json({ message: 'ยังไม่มีบิลในเดือนก่อน' });
                } else {
                    const currentDate = new Date(userroom.date_in);
                    const providedDate = new Date(year, month - 1, 1);

                    if (dayjs(currentDate).format('MM/YYYY') !== dayjs(providedDate).format('MM/YYYY')) {
                        return res.status(400).json({ message: 'ยังไม่ได้จดมิเตอร์เดือนก่อน' });
                    }
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
            }
        } else {
            return res.status(404).json({ message: 'ไม่เจอข้อมูล' });
        }

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const createInvoice: RequestHandler = async (req, res) => {
    let t;
    try {
        t = await Invoice.sequelize?.transaction();
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
                date_invoice: data.date_invoice,
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
        if (t) {
            await t.rollback();
        }
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
                model: Payment,
                include: [{
                    model: Payee
                }]
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
            },
            ]
        });
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
                date_invoice: invoice.date_invoice,
                fname_payee: invoice.payment[0]?.payee?.fname_payee,
                lname_payee: invoice.payment[0]?.payee?.lname_payee,
                payment_status: invoice.payment[0]?.payment_status,
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
        const year: any = req.params.year;

        const users = await Users.findAll({
            include: [
                {
                    model: UserRoom, attributes: ['idroom'], where: { status: 'active' },
                    include: [{
                        model: Room, attributes: ['room_number'],
                        include: [{
                            model: RoomType
                        }], order: [['room_number', 'DESC']],
                    },
                    {
                        model: Invoice,
                        include: [{
                            model: Payment, attributes: ['payment_status', 'updatedAt'],
                            include: [{ model: Payee }], where: { payment_status: "paid" }
                        }], where: {
                            [Op.and]: [{ date_invoice: { [Op.gte]: new Date(year, month - 1, 1) } }, { date_invoice: { [Op.lte]: new Date(year, month, 0) } }]
                        }
                    }
                    ]
                },
                { model: UserDetail, attributes: ['fname', 'lname'] },
            ],
        })

        if (users.length == 0) {
            return res.status(200).json({ data: [] });
        }

        users.forEach((user) => {
            data.push({
                room_number: user.user_room[0]?.room.room_number,
                username: user.username,
                name: user.user_detail[0]?.fname + ' ' + user.user_detail[0]?.lname,
                room_price: parseInt(user.user_room[0]?.room.roomtype.room_price),
                water_price: user.user_room[0]?.invoice[0]?.water_price * (user.user_room[0]?.invoice[0]?.watermeter_new - user.user_room[0]?.invoice[0]?.watermeter_old),
                electric_price: user.user_room[0]?.invoice[0]?.electric_price * (user.user_room[0]?.invoice[0]?.electricmeter_new - user.user_room[0]?.invoice[0]?.electricmeter_old),
                total: (
                    user.user_room[0]?.invoice[0]?.room_price +
                    (user.user_room[0]?.invoice[0]?.watermeter_new - user.user_room[0]?.invoice[0]?.watermeter_old) * user.user_room[0]?.invoice[0]?.water_price +
                    (user.user_room[0]?.invoice[0]?.electricmeter_new - user.user_room[0]?.invoice[0]?.electricmeter_old) * user.user_room[0]?.invoice[0]?.electric_price
                ),
                name_payee: user.user_room[0]?.invoice[0]?.payment[0]?.payee?.fname_payee + ' ' + user.user_room[0]?.invoice[0]?.payment[0]?.payee?.lname_payee,
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

export const getAllInvoiceMonthlys: RequestHandler = async (req, res) => {
    try {
        const data: object[] = []
        const month: any = req.params.month;
        const year: any = req.params.year;
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
                    {
                        model: Invoice, required: true,
                        include: [{
                            model: Payment, required: false, attributes: ['payment_status', 'updatedAt'],
                            include: [{ model: Payee }]
                        }],
                        where: { [Op.and]: [{ date_invoice: { [Op.gte]: new Date(year, month - 1, 1) } }, { date_invoice: { [Op.lte]: new Date(year, month, 0) } }] }
                    }
                    ]
                },
                { model: UserDetail, attributes: ['fname', 'lname'] },
            ],
        })

        const room = await Room.findAll();

        if (users.length == 0) {
            return res.status(200).json({ data: [] });
        }

        if (room.length == 0) {
            return res.status(200).json({ data: [] });
        }


        room.forEach((room, index) => {
            const roomUser = users.filter((user) => user.user_room[0]?.idroom === room.idroom);

            if (roomUser.length > 0) {
                roomUser.forEach((user) => {
                    const userRoom = user.user_room[0];
                    const invoice = userRoom.invoice[0];
                    const payment = invoice.payment[0];
                    const roomPrice = parseInt(userRoom.room.roomtype.room_price);

                    data.push({
                        room_number: userRoom?.room.room_number,
                        username: user.username,
                        name: user.user_detail[0]?.fname + ' ' + user.user_detail[0]?.lname,
                        room_price: roomPrice || 0,
                        water_price: invoice?.water_price * (invoice?.watermeter_new - invoice?.watermeter_old) || 0,
                        electric_price: invoice?.electric_price * (invoice?.electricmeter_new - invoice?.electricmeter_old) || 0,
                        total:
                            roomPrice +
                            ((invoice?.watermeter_new - invoice?.watermeter_old) || 0) * (invoice?.water_price || 0) +
                            ((invoice?.electricmeter_new - invoice?.electricmeter_old) || 0) * (invoice?.electric_price || 0),
                        payment_status: payment?.payment_status || '',
                        name_payee: payment?.payee?.fname_payee + ' ' + payment?.payee?.lname_payee,
                    });
                })
            } else {
                data.push({
                    room_number: room.room_number,
                    username: '-',
                    name: '-',
                    room_price: 0,
                    water_price: 0,
                    electric_price: 0,
                    total: 0,
                    payment_status: '',
                    updatedAt: '',
                    name_payee: '',
                });
            }
        })

        data.sort((a: any, b: any) => { return parseInt(a.room_number) - parseInt(b.room_number); });

        return res.status(200).json({ data: data });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const getInvoiceBymonth: RequestHandler = async (req, res) => {
    try {
        const data: object[] = []
        const month: any = req.params.month;
        const year: any = req.params.year;
        const datebefore = dayjs(new Date(year, month - 1, 1)).format('YYYY-MM-DD')
        const dateafter = dayjs(new Date(year, month, 0)).format('YYYY-MM-DD')

        const invoice = await Invoice.findAll({
            where: {
                date_invoice: { [Op.between]: [datebefore, dateafter] }
            },
            include: [{
                model: Payment,
                include: [{
                    model: Payee
                }]
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
            },
            ]
        });
        if (invoice) {
            invoice.forEach((invoice) => {
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
                    date_invoice: invoice.date_invoice,
                    fname_payee: invoice.payment[0]?.payee?.fname_payee,
                    lname_payee: invoice.payment[0]?.payee?.lname_payee,
                })
            })
            return res.status(200).json({ data: data });
        } else {
            return res.status(400).json({ data: [] });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const updateInvoiceByid: RequestHandler = async (req, res) => {
    try {
        const idinvoice = req.params.id;
        const invoice = await Invoice.findOne({
            where: { idinvoice: idinvoice },
            include: [{ model: Payment }]
        });
        if (invoice) {
            if (invoice.payment[0]?.payment_status == 'paid') {
                return res.status(400).json({ message: 'ไม่สามารถแก้ไขได้ เนื่องจากชำระบิลแล้ว' });
            } else {
                await Invoice.update({
                    watermeter_old: req.body.watermeter_old,
                    watermeter_new: req.body.watermeter_new,
                    electricmeter_old: req.body.electricmeter_old,
                    electricmeter_new: req.body.electricmeter_new,
                    water_price: req.body.water_price,
                    electric_price: req.body.electric_price,
                    date_invoice: req.body.date_invoice,
                }, { where: { idinvoice: idinvoice } });
                return res.status(200).json({ message: 'แก้ไขใบแจ้งหนี้สำเร็จ' });
            }
        } else {
            return res.status(404).json({ message: 'ไม่พบข้อมูลใบแจ้งหนี้' });
        }
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}
