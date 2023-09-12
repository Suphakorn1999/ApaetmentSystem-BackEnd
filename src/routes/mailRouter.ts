import { Router } from 'express';
import { sendMail } from '../controller/mailController';
const { verifyToken, verifyTokenAdmin } = require('../middlewares/jwtHandler');
const router = Router();

router.post('/sendmail/:id', verifyTokenAdmin, sendMail);

export default router;