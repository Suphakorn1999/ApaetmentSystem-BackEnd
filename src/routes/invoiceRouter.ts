import { Router } from 'express';
import { getallInvoices, getInvoiceByid, createInvoice } from '../controller/invoiceController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/invoices', verifyToken, getallInvoices);
router.get('/invoice/:id', verifyToken, getInvoiceByid);
router.post('/invoice', verifyToken, createInvoice);

export default router;

