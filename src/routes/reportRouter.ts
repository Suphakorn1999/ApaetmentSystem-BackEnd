import { Router } from "express";
import { createReportType, getallReportType, updateReportType, getReportTypeByid, getAllReport, createReport, getReportByid, updateReportByid, getReportByiduser, getallReportByiduser } from "../controller/reportController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.post('/createReportType', verifyToken, createReportType);
router.get('/getallReportType', verifyToken, getallReportType);
router.put('/updateReportType/:id', verifyToken, updateReportType);
router.get('/getReportTypeByid/:id', verifyToken, getReportTypeByid);
router.get('/getAllReport', verifyToken, getAllReport);
router.post('/createReport', verifyToken, createReport);
router.get('/getReportByid/:id', verifyToken, getReportByid);
router.put('/updateReportByid/:id', verifyToken, updateReportByid);
router.get('/getReportByiduser', verifyToken, getReportByiduser);
router.get('/getallReportByiduser', verifyToken, getallReportByiduser);

export default router;