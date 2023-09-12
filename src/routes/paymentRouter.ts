import { Router } from 'express';
import { createPaymentType, getallPaymentType, getPaymentByidinvoice, updatePaymentByidinvoice, 
    getPaymentByTokenUser, updatePaymentByidinvoiceAndUploadfile, getAllpayee, createPayee, updatePayee, getpayeeByid } from '../controller/paymentController';
const { verifyToken, verifyTokenAdmin, verifyTokenUser } = require('../middlewares/jwtHandler');
const router = Router();

router.post('/paymenttype', verifyToken, createPaymentType);
router.get('/paymenttype', verifyToken, getallPaymentType);
router.get('/payment/:id', verifyToken, getPaymentByidinvoice);
router.put('/payment/:id', verifyToken, updatePaymentByidinvoice);
router.get('/payment', verifyTokenUser, getPaymentByTokenUser);
router.post('/payment/upload/:id', verifyTokenUser, updatePaymentByidinvoiceAndUploadfile);
router.get('/getAllPayee', verifyToken, getAllpayee);
router.post('/createPayee', verifyToken, createPayee);
router.put('/updatePayee/:id', verifyToken, updatePayee);
router.get('/getPayee/:id', verifyToken, getpayeeByid);

export default router;