import { Router } from 'express';
import { createPaymentType, getallPaymentType, getPaymentByidinvoice, updatePaymentByidinvoice, getPaymentByTokenUser } from '../controller/paymentController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.post('/paymenttype', verifyToken, createPaymentType);
router.get('/paymenttype', verifyToken, getallPaymentType);
router.get('/payment/:id', verifyToken, getPaymentByidinvoice);
router.put('/payment/:id', verifyToken, updatePaymentByidinvoice);
router.get('/payment', verifyToken, getPaymentByTokenUser);

export default router;