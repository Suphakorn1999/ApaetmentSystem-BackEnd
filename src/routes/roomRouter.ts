import { Router } from "express";
import { getallRoom, createRoom, createRoomType, getRoomtype, getRoomTypeByid, updateRoomType, getRoomByid, updateRoom  } from "../controller/roomController";

const router = Router();

router.get('/getRoom', getallRoom);
router.get('/getRoomtype', getRoomtype);
router.get('/getRoomtype/:id', getRoomTypeByid);
router.get('/getRoom/:id', getRoomByid);


router.post('/createRoom', createRoom);
router.post('/createRoomType', createRoomType);


router.put('/updateRoomType/:id', updateRoomType);
router.put('/updateRoom/:id', updateRoom);



export default router;