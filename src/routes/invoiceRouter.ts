import { Router } from 'express';
import { getallInvoices, getInvoiceByid, createInvoice, getInvoiceByidInvoice, getInvoiceMonthlyByToken, getAllInvoiceByToken, getAllInvoiceMonthly, getAllInvoiceMonthlys } from '../controller/invoiceController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/invoices/:month/:year', verifyToken, getallInvoices);
router.get('/invoice/:id', verifyToken, getInvoiceByid);
router.get('/invoiceid/:id', verifyToken, getInvoiceByidInvoice);
router.post('/invoice', verifyToken, createInvoice);
router.get('/invoicemonthly', verifyToken, getInvoiceMonthlyByToken);
router.get('/invoiceall', verifyToken, getAllInvoiceByToken);
router.get('/invoicemonthlyall/:month/:year', verifyToken, getAllInvoiceMonthly);
router.get('/invoicemonthlysalls/:month/:year', verifyToken, getAllInvoiceMonthlys);

export default router;

