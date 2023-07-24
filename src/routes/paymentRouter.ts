import { Router } from 'express';
import { createPaymentType, getallPaymentType } from '../controller/paymentController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.post('/paymenttype', verifyToken, createPaymentType);
router.get('/paymenttype', verifyToken, getallPaymentType);

export default router;