import { RequestHandler } from 'express';
import { Users } from '../models/userModel';
import { Room } from '../models/roomModel';
import { Report } from '../models/reportModel';

export const getCountAll: RequestHandler = async (req, res) => {
    try {
        const user = await Users.count({where: {idrole: 2}});
        const room = await Room.count();
        const report = await Report.count();
        return res.status(200).json({ user: user, room: room, report: report });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}