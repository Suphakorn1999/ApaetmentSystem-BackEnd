import { Router } from 'express';
import { createPaymentType } from '../controller/paymentController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.post('/paymenttype', verifyToken, createPaymentType);

export default router;