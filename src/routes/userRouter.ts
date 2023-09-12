import { Router } from "express";
import { getallUsers, register, ChangePassword, getRoles } from "../controller/userController";
const { verifyToken, verifyTokenAdmin } = require('../middlewares/jwtHandler');

const router = Router();

router.get('/', verifyToken, getallUsers);
router.get('/roles', verifyToken, getRoles);
router.post('/register', verifyTokenAdmin, register);
router.post('/resetPassword', verifyToken, ChangePassword);

export default router;

