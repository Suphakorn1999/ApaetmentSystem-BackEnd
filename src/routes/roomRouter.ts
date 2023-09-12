import { Router } from "express";
import { getallRoom, createRoom, createRoomType, getRoomtype, getRoomTypeByid, updateRoomType, getRoomByid, updateRoom, getAllUserInRoom, getAllUserInRooms, getRoomtypedrop, createUserRoom, getRoomEmptyAndUsernotInRoom  } from "../controller/roomController";
const { verifyTokenAdmin } = require('../middlewares/jwtHandler');

const router = Router();

router.get('/getRoom', verifyTokenAdmin, getallRoom);
router.get('/getRoomtype', verifyTokenAdmin, getRoomtype);
router.get('/getRoomtype/:id', verifyTokenAdmin, getRoomTypeByid);
router.get('/getRoom/:id', verifyTokenAdmin, getRoomByid);
router.get('/getAllUserInRoom', verifyTokenAdmin, getAllUserInRoom);
router.get('/getAllUserInRooms/:month/:year', verifyTokenAdmin, getAllUserInRooms);
router.get('/getRoomtypedrop', verifyTokenAdmin, getRoomtypedrop);
router.get('/getRoomEmptyAndUsernotInRoom', verifyTokenAdmin, getRoomEmptyAndUsernotInRoom);


router.post('/createRoom', verifyTokenAdmin, createRoom);
router.post('/createRoomType', verifyTokenAdmin, createRoomType);
router.post('/createUserRoom', verifyTokenAdmin, createUserRoom);


router.put('/updateRoomType/:id', verifyTokenAdmin, updateRoomType);
router.put('/updateRoom/:id', verifyTokenAdmin, updateRoom);



export default router;