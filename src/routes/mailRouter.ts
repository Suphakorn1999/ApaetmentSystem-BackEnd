import { Router } from 'express';
import { sendMail } from '../controller/mailController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.post('/sendmail/:id', verifyToken, sendMail);

export default router;