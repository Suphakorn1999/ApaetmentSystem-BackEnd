import { Router } from "express";
import { getallProvinces, getDistrictsbyidProvinces, getSubDistrictsbyidDistricts, getallDistricts, getallSubDistricts } from "../controller/provinceController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.get('/provinces', verifyToken, getallProvinces);
router.get('/districts/:id', verifyToken, getDistrictsbyidProvinces);
router.get('/subdistricts/:id', verifyToken ,getSubDistrictsbyidDistricts);
router.get('/districts', verifyToken, getallDistricts);
router.get('/subdistricts', verifyToken, getallSubDistricts);

export default router;