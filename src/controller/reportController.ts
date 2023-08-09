import { RequestHandler } from 'express';
import { Report } from '../models/reportModel';
import { ReportType } from '../models/reporttypeModel';
import { Users } from '../models/userModel';
import { Op } from 'sequelize';
import { UserRoom } from '../models/user_roomModel';
import { Room } from '../models/roomModel';

export const createReport: RequestHandler = async (req, res) => {
    try {
        const data: Report = req.body;
        const iduser = req.body.user.id;
        const report = await Report.create({
            iduser: iduser,
            idreport_type: data.idreport_type,
            report_description: data.report_description,
        });
        return res.status(200).json({ message: 'เพิ่มรายงานสำเร็จ' });
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
            report_type: data.report_type
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
        const report = await Report.findAll({ include: [{ model: Users, include: [{ model: UserRoom, where: { status: 'active' }, include: [{ model: Room }] }] }, { model: ReportType, attributes: ['report_type'] }] });
        if (report.length == 0) {
            return res.status(404).json({ message: 'ไม่มีรายงาน' });
        }

        for (let i = 0; i < report.length; i++) {
            if (report[i].user.user_room.length != 0) {
                data.push({
                    idreport: report[i].idreport,
                    room_number: report[i].user.user_room[0].room.room_number,
                    report_type: report[i].report_type.report_type,
                    report_description: report[i].report_description,
                    report_status: report[i].report_status,
                    createdAt: report[i].createdAt,
                    updatedAt: report[i].updatedAt,
                });
            }
        }

        return res.status(200).json({ data: data });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getReportByid: RequestHandler = async (req, res) => {
    try {
        const data: object[] = [];
        const report = await Report.findOne({ include: [{ model: Users, include: [{ model: UserRoom, where: { status: 'active' }, include: [{ model: Room }] }] }, { model: ReportType, attributes: ['report_type'] }], where: { idreport: req.params.id } })
        if (report) {
            if (report.user.user_room.length != 0) {
                data.push({
                    idreport: report.idreport,
                    room_number: report.user.user_room[0].room.room_number,
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
        const report = await Report.findAll({ include: [{ model: Users, include: [{ model: UserRoom, where: { status: 'active' }, include: [{ model: Room }] }] }, { model: ReportType, attributes: ['report_type'] }], where: { [Op.and]: [{ iduser: req.body.user.id }, { report_status: { [Op.notLike]: 'done' } }] }, limit: 2, order: [['createdAt', 'DESC']] })
        if (report.length == 0) {
            return res.status(200).json({ data: [] });
        }

        for (let i = 0; i < report.length; i++) {
            if (report[i].user.user_room.length != 0) {
                data.push({
                    report_type: report[i].report_type.report_type,
                    report_status: report[i].report_status,
                });
            }
        }

        return res.status(200).json({ data: data });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getallReportByiduser: RequestHandler = async (req, res) => {
    try {
        const data: object[] = [];
        const report = await Report.findAll({ include: [{ model: Users, include: [{ model: UserRoom, where: { status: 'active' }, include: [{ model: Room }] }] }, { model: ReportType, attributes: ['report_type'] }], where: { iduser: req.body.user.id } })
        if (report.length == 0) {
            return res.status(200).json({ data: [] });
        }

        for (let i = 0; i < report.length; i++) {
            if (report[i].user.user_room.length != 0) {
                data.push({
                    idreport: report[i].idreport,
                    room_number: report[i].user.user_room[0].room.room_number,
                    report_type: report[i].report_type.report_type,
                    report_description: report[i].report_description,
                    report_status: report[i].report_status,
                    createdAt: report[i].createdAt,
                    updatedAt: report[i].updatedAt
                });
            }
        }

        return res.status(200).json({ data: data });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

