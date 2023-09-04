import { Router } from 'express';
import { createPaymentType, getallPaymentType, getPaymentByidinvoice, updatePaymentByidinvoice, 
    getPaymentByTokenUser, updatePaymentByidinvoiceAndUploadfile, getAllpayee, createPayee, updatePayee } from '../controller/paymentController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.post('/paymenttype', verifyToken, createPaymentType);
router.get('/paymenttype', verifyToken, getallPaymentType);
router.get('/payment/:id', verifyToken, getPaymentByidinvoice);
router.put('/payment/:id', verifyToken, updatePaymentByidinvoice);
router.get('/payment', verifyToken, getPaymentByTokenUser);
router.post('/payment/upload/:id', verifyToken, updatePaymentByidinvoiceAndUploadfile);
router.get('/getAllPayee', verifyToken, getAllpayee);
router.post('/createPayee', verifyToken, createPayee);
router.put('/updatePayee/:id', verifyToken, updatePayee);

export default router;