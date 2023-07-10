import { Router } from "express";
import { createUserDetail, getUserDetailByToken, uploadImage, getUserAllDetail, getUserDetailbyid, updateUserUserDetailByid } from "../controller/profileController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.post('/createProfile', verifyToken, createUserDetail);
router.get('/getProfile', verifyToken, getUserDetailByToken);
router.post('/uploadImage', verifyToken, uploadImage);
router.get('/getAllProfile', verifyToken, getUserAllDetail);
router.get('/getProfileById/:id', verifyToken, getUserDetailbyid);
router.put('/updateProfileById/:id', verifyToken, updateUserUserDetailByid);


export default router;