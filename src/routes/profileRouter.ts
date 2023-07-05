import { Router } from "express";
import { createUserDetail, getUserDetailByid } from "../controller/profileController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.post('/createProfile', verifyToken, createUserDetail);
router.get('/getProfile', verifyToken, getUserDetailByid);


export default router;