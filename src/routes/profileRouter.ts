import { Router } from "express";
import { createUserDetail, getUserDetailByToken, uploadImage, getUserAllDetail, getUserDetailbyid, updateUserUserDetailByid, getIdroomByiduser, updateidRoomByiduser,
    deleteUserDetailByid } from "../controller/profileController";
const { verifyToken, verifyTokenAdmin } = require('../middlewares/jwtHandler');

const router = Router();

router.post('/createProfile', verifyToken, createUserDetail);
router.get('/getProfile', verifyToken, getUserDetailByToken);
router.post('/uploadImage', verifyToken, uploadImage);
router.get('/getAllProfile', verifyTokenAdmin, getUserAllDetail);
router.get('/getProfileById/:id', verifyToken, getUserDetailbyid);
router.put('/updateProfileById/:id', verifyToken, updateUserUserDetailByid);
router.get('/getIdroomByiduser/:id', verifyToken, getIdroomByiduser);
router.post('/updateidRoomByiduser/:id', verifyToken, updateidRoomByiduser);
router.delete('/deleteProfileById/:id', verifyTokenAdmin, deleteUserDetailByid);


export default router;