import { Router } from "express";
import { createReportType, getallReportType, updateReportType, getReportTypeByid, 
    getAllReport, createReport, getReportByid, updateReportByid, getReportByiduser, 
    getallReportByiduser, getCountReportByididreporttype, getCountRoomByidreporttype, getReportMonthlys,
    getallReportTypetable
} from "../controller/reportController";
const { verifyToken, verifyTokenAdmin, verifyTokenUser } = require('../middlewares/jwtHandler');

const router = Router();

router.post('/createReportType', verifyTokenAdmin, createReportType);
router.get('/getallReportType', verifyToken, getallReportType);
router.put('/updateReportType/:id', verifyTokenAdmin, updateReportType);
router.get('/getReportTypeByid/:id', verifyTokenAdmin, getReportTypeByid);
router.get('/getAllReport', verifyTokenAdmin, getAllReport);
router.post('/createReport', verifyTokenUser, createReport);
router.get('/getReportByid/:id', verifyToken, getReportByid);
router.put('/updateReportByid/:id', verifyToken, updateReportByid);
router.get('/getReportByiduser', verifyTokenUser, getReportByiduser);
router.get('/getallReportByiduser', verifyTokenUser, getallReportByiduser);
router.get('/getCountReportByididreporttype', verifyTokenAdmin, getCountReportByididreporttype);
router.get('/getCountRoomByidreporttype/:id', verifyTokenAdmin, getCountRoomByidreporttype);
router.get('/getReportMonthlys/:month/:year', verifyTokenAdmin, getReportMonthlys);
router.get('/getallReportTypetable', verifyTokenAdmin, getallReportTypetable);

export default router;