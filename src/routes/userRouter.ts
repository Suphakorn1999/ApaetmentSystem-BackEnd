import { Router } from "express";
import { getallUsers, register, ChangePassword } from "../controller/userController";
const { verifyToken } = require('../middlewares/jwtHandler');

const router = Router();

router.get('/', verifyToken, getallUsers);
router.post('/register', register);
router.post('/resetPassword', verifyToken, ChangePassword);

export default router;

