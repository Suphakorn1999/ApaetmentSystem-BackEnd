import { Router } from "express";
import { getallRoom, createRoom, createRoomType, getRoomtype, getRoomTypeByid, updateRoomType, getRoomByid, updateRoom  } from "../controller/roomController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.get('/getRoom', verifyToken, getallRoom);
router.get('/getRoomtype', verifyToken, getRoomtype);
router.get('/getRoomtype/:id', verifyToken, getRoomTypeByid);
router.get('/getRoom/:id', verifyToken, getRoomByid);


router.post('/createRoom', verifyToken, createRoom);
router.post('/createRoomType', verifyToken, createRoomType);


router.put('/updateRoomType/:id', verifyToken, updateRoomType);
router.put('/updateRoom/:id', verifyToken, updateRoom);



export default router;