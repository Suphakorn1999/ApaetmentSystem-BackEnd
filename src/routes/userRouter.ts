import { Router } from "express";
import { getallUsers, register, ChangePassword, getRoles } from "../controller/userController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.get('/', verifyToken, getallUsers);
router.get('/roles', verifyToken, getRoles);
router.post('/register', verifyToken, register);
router.post('/resetPassword', verifyToken, ChangePassword);

export default router;

