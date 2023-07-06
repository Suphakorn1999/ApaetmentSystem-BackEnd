import { Router } from "express";
import { createUserDetail, getUserDetailByid, uploadImage } from "../controller/profileController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.post('/createProfile', verifyToken, createUserDetail);
router.get('/getProfile', verifyToken, getUserDetailByid);
router.post('/uploadImage', verifyToken, uploadImage);


export default router;