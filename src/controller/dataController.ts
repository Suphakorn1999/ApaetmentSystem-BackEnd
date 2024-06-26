import e, { RequestHandler } from 'express';
import { Users } from '../models/userModel';
import { Room } from '../models/roomModel';
import { Report } from '../models/reportModel';
import { Op } from 'sequelize';
import { Payment } from '../models/paymentModel';
import { Invoice } from '../models/invoiceModel';
import { Sequelize } from 'sequelize-typescript';
import { RoomType } from '../models/roomtypeModel';
import { UserRoom } from '../models/user_roomModel';
import { UserDetail } from '../models/userdetailModel';
import { exec, spawn } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import fs from 'fs';


export const getCountAll: RequestHandler = async (req, res) => {
    try {
        const countReport = await Report.count({
            where: {
                [Op.or]: [{ report_status: "pending" }, { report_status: "inprogress" }]
            }
        });

        const countRoomAll = await Room.count();

        const countRoomEmptyAll = await Room.count({
            where: {
                [Op.and]: [
                    { status_room: 'active' },
                    { room_status: 'empty' }
                ]
            }
        });

        const countRoomFullAll = await Room.count({
            where: {
                [Op.and]: [
                    { status_room: 'active' },
                    { room_status: 'full' }
                ]
            }
        });

        const roomTypes = await RoomType.findAll({
            attributes: ['idroom_type', 'room_type_name']
        });

        const data: { room_type_name: string; room_type_empty: number; room_type_full: number; }[] = [];

        for (const roomType of roomTypes) {
            const roomTypeEmptyCount = await Room.count({
                where: {
                    [Op.and]: [
                        { status_room: 'active' },
                        { room_status: 'empty' },
                        { idroom_type: roomType.idroom_type }
                    ]
                }
            });

            const roomTypeFullCount = await Room.count({
                where: {
                    [Op.and]: [
                        { status_room: 'active' },
                        { room_status: 'full' },
                        { idroom_type: roomType.idroom_type }
                    ]
                }
            });

            data.push({
                room_type_name: roomType.room_type_name,
                room_type_empty: roomTypeEmptyCount,
                room_type_full: roomTypeFullCount,
            });
        }

        return res.status(200).json({ countReport, data, countRoomEmptyAll, countRoomFullAll, countRoomAll });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export const getmonthlyincomecount = async (req: any, res: any) => {
    try {
        const { year } = req.query;
        const monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];
        const monthlyIncome = await Payment.MonthlyIncomecount(year);

        const barChartData = monthlyIncome.map((income: any, index) => {
            return {
                เดือน: monthNames[index],
                จ่ายแล้ว: income.paid,
                ค้างจ่าย: income.pending
            }
        });

        return res.status(200).json({ data: barChartData });

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
        const monthlyIncome = await Payment.MonthlyIncome(year);

        const barChartData = monthlyIncome.map((income: any, index) => {
            return {
                เดือน: monthNames[index],
                จ่ายแล้ว: income.paid,
                ค้างจ่าย: income.pending
            }
        });

        return res.status(200).json({ data: barChartData });

    }
    catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getCountBadge = async (req: any, res: any) => {
    try {
        const countReport = await Report.count({ where: { [Op.or]: [{ report_status: "pending" }, { report_status: "inprogress" }] } });
        const invoices = await Invoice.count({
            include: [
                { model: Payment, where: { [Op.or]: [{ payment_status: 'pending' }, { payment_status: 'unpaid' }] } },
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
        });

        return res.status(200).json({ countReport: countReport, countInvoice: invoices });

    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const backupdatabase = async (req: any, res: any) => {
    //localhost
    // try {
    //     const dbName = process.env.NAME_DB;
    //     const month = new Date().getMonth() + 1;
    //     const year = new Date().getFullYear();
    //     const username = process.env.USER_DB;
    //     const password = process.env.PASSWORD_DB;
    //     const host = process.env.HOST_DB;
    //     const backupFileName = `${dbName}_${month}_${year}.sql`;
    //     const mysqldumpPath = 'C:/xampp/mysql/bin/mysqldump.exe';
    //     const backupFilePath = path.resolve(`public/backup/${backupFileName}`);

    //     const mysqldumpCmd = spawn(mysqldumpPath, [
    //         `--host=${host}`,
    //         `--user=${username}`,
    //         `--password=${password}`,
    //         `${dbName}`,
    //     ]);

    //     const backupStream = require('fs').createWriteStream(backupFilePath);

    //     mysqldumpCmd.stdout.pipe(backupStream);

    //     mysqldumpCmd.on('error', (err) => {
    //         console.error(err);
    //         return res.status(500).json({ error: 'Failed to create database backup' });
    //     });

    //     mysqldumpCmd.on('exit', (code) => {
    //         if (code === 0) {
    //             return res.attachment(backupFilePath).sendFile(backupFilePath, (err: any) => {
    //                 if (err) {
    //                     console.error(err);
    //                     return res.status(500).json({ error: 'Failed to send backup file' });
    //                 }
    //             });
    //         } else {
    //             console.error(code);
    //             return res.status(500).json({ error: 'Failed to create database backup' });
    //         }
    //     });

    // } catch (err: any) {
    //     return res.status(500).json({ message: err.message });
    // }
    //server
    try {
        const dbName = process.env.NAME_DB;
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const username = process.env.USER_DB;
        const password = process.env.PASSWORD_DB;
        const host = process.env.HOST_DB;
        const backupFileName = `${dbName}_${month}_${year}.sql`;
        const backupFilePath = path.resolve(path.join(__dirname, `../../public/backup/${backupFileName}`));


        const mysqldumpCmd = spawn('mysqldump', [
            `--host=${host}`,
            `--user=${username}`,
            `--password=${password}`,
            `${dbName}`,
        ]);

        const backupStream = fs.createWriteStream(backupFilePath);

        mysqldumpCmd.stdout.pipe(backupStream);

        mysqldumpCmd.on('error', (err) => {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create database backup' });
        });

        mysqldumpCmd.on('exit', (code) => {
            if (code === 0) {
                return res.attachment(backupFilePath).sendFile(backupFilePath, (err: any) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Failed to send backup file' });
                    }
                });
            } else {
                console.error(code);
                return res.status(500).json({ error: 'Failed to create database backup' });
            }
        });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}



