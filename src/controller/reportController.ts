import { RequestHandler } from 'express';
import { Report } from '../models/reportModel';
import { ReportType } from '../models/reporttypeModel';
import { Users } from '../models/userModel';
import { Op, where } from 'sequelize';
import { UserRoom } from '../models/user_roomModel';
import { Room } from '../models/roomModel';
import { UserDetail } from '../models/userdetailModel';

export const createReport: RequestHandler = async (req, res) => {
    try {
        const data: Report = req.body;
        const iduser = req.body.user.id;
        const userRoom = await UserRoom.findOne({ where: { iduser: iduser, status: 'active' } });
        if (userRoom) {
            const report = await Report.create({
                iduser_room: userRoom.iduser_room,
                idreport_type: data.idreport_type,
                report_description: data.report_description,
            });
            return res.status(200).json({ message: 'เพิ่มรายงานสำเร็จ' });
        }
        else {
            return res.status(400).json({ message: 'ไม่สามารถเพิ่มรายงานได้' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createReportType: RequestHandler = async (req, res) => {
    try {
        const { report_type } = req.body;
        const reportType = await ReportType.findOne({ where: { report_type: report_type } });
        if (reportType) {
            return res.status(400).json({ message: 'ประเภทรายงานนี้มีอยู่แล้ว' });
        } else {
            const reportType = await ReportType.create({ report_type: report_type });
            return res.status(200).json({ message: 'เพิ่มประเภทรายงานสำเร็จ' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getallReportType: RequestHandler = async (req, res) => {
    try {
        const reportType = await ReportType.findAll({ where: { status: 'active' } });
        if (reportType.length == 0) {
            return res.status(404).json({ message: 'ไม่มีประเภทรายงาน' });
        }
        return res.status(200).json({ data: reportType });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getallReportTypetable: RequestHandler = async (req, res) => {
    try {
        const reportType = await ReportType.findAll();
        if (reportType.length == 0) {
            return res.status(404).json({ message: 'ไม่มีประเภทรายงาน' });
        }
        return res.status(200).json({ data: reportType });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const updateReportType: RequestHandler = async (req, res) => {
    try {
        const data: ReportType = req.body;
        const reportType = await ReportType.update({
            report_type: data.report_type,
            status: data.status
        }, { where: { idreport_type: req.params.id } });
        if (reportType) {
            return res.status(200).json({ message: 'แก้ไขประเภทรายงานสำเร็จ' });
        } else {
            return res.status(400).json({ message: 'แก้ไขประเภทรายงานไม่สำเร็จ' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getReportTypeByid: RequestHandler = async (req, res) => {
    try {
        const reportType = await ReportType.findOne({ where: { idreport_type: req.params.id } });
        if (reportType) {
            return res.status(200).json({ data: reportType });
        } else {
            return res.status(404).json({ message: 'ไม่พบประเภทรายงาน' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getAllReport: RequestHandler = async (req, res) => {
    try {
        const data: object[] = [];
        const report = await Report.findAll({
            include: [{
                model: UserRoom, where: { status: 'active' }, include: [{ model: Room }, { model: Users, include: [{ model: UserDetail, attributes: ['fname', 'lname'] }] }]
            }, {
                model: ReportType,
                attributes: ['report_type']
            }],
        });


        if (report.length == 0) {
            return res.status(404).json({ message: 'ไม่มีรายงาน' });
        }

        report.forEach((element: any) => {
            data.push({
                idreport: element.idreport,
                room_number: element.user_room.room.room_number,
                report_type: element.report_type.report_type,
                report_description: element.report_description,
                report_status: element.report_status,
                createdAt: element.createdAt,
                updatedAt: element.updatedAt
            });
        });

        return res.status(200).json({ data: data });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getReportByid: RequestHandler = async (req, res) => {
    try {
        const data: object[] = [];
        const report = await Report.findOne({
            include: [{
                model: ReportType, attributes: ['report_type']
            },
            {
                model: UserRoom, where: { status: 'active' }, include: [{ model: Room }, { model: Users, include: [{ model: UserDetail, attributes: ['fname', 'lname'] }] }]
            }
            ],
            where: { idreport: req.params.id }
        })

        if (report) {
            if (report.user_room != null) {
                data.push({
                    idreport: report.idreport,
                    room_number: report.user_room.room.room_number,
                    report_type: report.report_type.report_type,
                    report_description: report.report_description,
                    report_status: report.report_status,
                    createdAt: report.createdAt,
                    updatedAt: report.updatedAt
                });
            }

            return res.status(200).json({ data: data });
        } else {
            return res.status(404).json({ message: 'ไม่พบรายงาน' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const updateReportByid: RequestHandler = async (req, res) => {
    try {
        const data: Report = req.body;
        const report = await Report.update({
            report_status: data.report_status
        }, { where: { idreport: req.params.id } });
        if (report) {
            return res.status(200).json({ message: 'แก้ไขรายงานสำเร็จ' });
        } else {
            return res.status(400).json({ message: 'แก้ไขรายงานไม่สำเร็จ' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getReportByiduser: RequestHandler = async (req, res) => {
    try {
        const data: object[] = [];
        const userRoom = await UserRoom.findOne({ where: { iduser: req.body.user.id, status: 'active' } });
        if (userRoom) {
            const report = await Report.findAll({
                include: [{
                    model: UserRoom, where: { status: 'active' }, include: [{ model: Room }, { model: Users, include: [{ model: UserDetail, attributes: ['fname', 'lname'] }] }]
                }, { model: ReportType, attributes: ['report_type'] }],
                where: { [Op.and]: [{ iduser_room: userRoom.iduser_room }, { report_status: { [Op.notLike]: 'done' } }] }, limit: 2, order: [['createdAt', 'DESC']]
            })
            if (report.length == 0) {
                return res.status(200).json({ data: [] });
            }

            for (let i = 0; i < report.length; i++) {
                if (report) {
                    data.push({
                        report_type: report[i].report_type.report_type,
                        report_status: report[i].report_status,
                    });
                }
            }

            return res.status(200).json({ data: data });
        } else {
            return res.status(404).json({ message: 'ไม่พบห้องพัก' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getallReportByiduser: RequestHandler = async (req, res) => {
    try {
        const data: object[] = [];
        const userRoom = await UserRoom.findOne({ where: { iduser: req.body.user.id, status: 'active' } });
        if (userRoom) {
            const report = await Report.findAll({
                include: [{
                    model: UserRoom, where: { status: 'active' }, include: [{ model: Room }, { model: Users, include: [{ model: UserDetail, attributes: ['fname', 'lname'] }] }]
                },
                { model: ReportType, attributes: ['report_type'] }], where: { iduser_room: userRoom.iduser_room }
            })
            if (report.length == 0) {
                return res.status(200).json({ data: [] });
            }

            for (let i = 0; i < report.length; i++) {
                if (report) {
                    data.push({
                        idreport: report[i].idreport,
                        room_number: report[i].user_room.room.room_number,
                        report_type: report[i].report_type.report_type,
                        report_description: report[i].report_description,
                        report_status: report[i].report_status,
                        createdAt: report[i].createdAt,
                        updatedAt: report[i].updatedAt
                    });
                }
            }

            return res.status(200).json({ data: data });
        } else {
            return res.status(404).json({ message: 'ไม่พบห้องพัก' });
        }
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getCountReportByididreporttype: RequestHandler = async (req, res) => {
    try {
        const report_type: ReportType[] = await ReportType.findAll({ attributes: ['idreport_type', 'report_type'] });
        const data: object[] = [];

        for (let i = 0; i < report_type.length; i++) {
            const count = await Report.count({ where: { [Op.and]: [{ idreport_type: report_type[i].idreport_type }] } });

            if (count > 0) {
                data.push({
                    idreport_type: report_type[i].idreport_type,
                    report_type: report_type[i].report_type,
                    count: count,
                    ประเภทรายงาน: report_type[i].report_type,
                    จำนวน: count
                });
            }
        }

        data.sort((a: any, b: any) => { return b.count - a.count });


        return res.status(200).json({ data: data });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getCountRoomByidreporttype: RequestHandler = async (req, res) => {
    try {
        const idreport_type = req.params.id;
        const data: object[] = [];

        const userRoom = await UserRoom.findAll({ where: { status: 'active' }, include: [{ model: Room }] });

        for (let i = 0; i < userRoom.length; i++) {
            const count = await Report.count({ where: { [Op.and]: [{ iduser_room: userRoom[i].iduser_room }, { idreport_type: idreport_type }] } });

            if (count > 0) {
                data.push({
                    room_number: userRoom[i].room.room_number,
                    count: count,
                    หมายเลขห้อง: userRoom[i].room.room_number,
                    จำนวน: count
                });
            }
        }

        data.sort((a: any, b: any) => { return b.count - a.count });

        return res.status(200).json({ data: data });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getReportMonthlys: RequestHandler = async (req, res) => {
    try {
        const data: object[] = [];
        const month = req.params.month || new Date().getMonth() + 1;
        const year = req.params.year || new Date().getFullYear();
        const report = await Report.findAll({
            include: [{
                model: UserRoom, where: { status: 'active' }, include: [{ model: Room }, { model: Users, include: [{ model: UserDetail, attributes: ['fname', 'lname'] }] }]
            }, { model: ReportType, attributes: ['report_type'] }],
            where: { [Op.and]: [{ createdAt: { [Op.lte]: new Date(`${year}-${month}-31`) } }, { createdAt: { [Op.gte]: new Date(`${year}-${month}-01`) } }] }
        })

        const room = await Room.findAll();
        const report_type = await ReportType.findAll();

        if (report.length == 0) {
            return res.status(404).json({ data: [] });
        }

        if (room.length == 0) {
            return res.status(404).json({ data: [] });
        }

        room.forEach((element: any) => {
            const roomUser = report.filter((report: any) => report.user_room.room.room_number == element.room_number);
            const roomReport = report_type.map((report_type: any) => {
                const reportType = roomUser.filter((report: any) => report.report_type.report_type == report_type.report_type);
                return {
                    room_number: element.room_number,
                    report_type: report_type.report_type,
                    count: reportType.length,
                }
            });
            data.push({
                room_number: element.room_number,
                report: roomReport
            });
        });

        return res.status(200).json({ data: data, report_type: report_type });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}


