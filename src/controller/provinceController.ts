import { RequestHandler } from 'express';
import { Provinces } from '../models/provincesModel';
import { Districts } from '../models/districtsModel';
import { SubDistricts } from '../models/sub_districtsModel';

export const getallProvinces: RequestHandler = async (req, res) => {
    try {
        const provinces = await Provinces.findAll({order: [['name_th', 'ASC']]});
        res.status(200).json({data: provinces});
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
}

export const getallDistricts: RequestHandler = async (req, res) => {
    try {
        const districts = await Districts.findAll({order: [['name_th', 'ASC']]});
        res.status(200).json({data: districts});
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
}

export const getallSubDistricts: RequestHandler = async (req, res) => {
    try {
        const sub_districts = await SubDistricts.findAll({order: [['name_th', 'ASC']]});
        res.status(200).json({data: sub_districts});
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
}

export const getDistrictsbyidProvinces: RequestHandler = async (req, res) => {
    try {
        const districts = await Districts.findAll({ where: { province_id: req.params.id } });
        res.status(200).json({data: districts});
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
}

export const getSubDistrictsbyidDistricts: RequestHandler = async (req, res) => {
    try {
        const sub_districts = await SubDistricts.findAll({ where: { districts_id: req.params.id } });
        res.status(200).json({data: sub_districts});
    } catch (err:any) {
        res.status(500).json({ message: err.message });
    }
}






