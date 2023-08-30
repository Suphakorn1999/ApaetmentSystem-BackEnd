import { Router } from "express";
import { getallRoom, createRoom, createRoomType, getRoomtype, getRoomTypeByid, updateRoomType, getRoomByid, updateRoom, getAllUserInRoom, getAllUserInRooms, getRoomtypedrop, createUserRoom, getRoomEmptyAndUsernotInRoom  } from "../controller/roomController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.get('/getRoom', verifyToken, getallRoom);
router.get('/getRoomtype', verifyToken, getRoomtype);
router.get('/getRoomtype/:id', verifyToken, getRoomTypeByid);
router.get('/getRoom/:id', verifyToken, getRoomByid);
router.get('/getAllUserInRoom', verifyToken, getAllUserInRoom);
router.get('/getAllUserInRooms', verifyToken, getAllUserInRooms);
router.get('/getRoomtypedrop', verifyToken, getRoomtypedrop);
router.get('/getRoomEmptyAndUsernotInRoom', verifyToken, getRoomEmptyAndUsernotInRoom);


router.post('/createRoom', verifyToken, createRoom);
router.post('/createRoomType', verifyToken, createRoomType);
router.post('/createUserRoom', verifyToken, createUserRoom);


router.put('/updateRoomType/:id', verifyToken, updateRoomType);
router.put('/updateRoom/:id', verifyToken, updateRoom);



export default router;