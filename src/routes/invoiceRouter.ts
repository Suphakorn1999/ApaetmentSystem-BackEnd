import { Router } from 'express';
import { getallInvoices, getInvoiceByid, createInvoice, getInvoiceByidInvoice, 
    getInvoiceMonthlyByToken, getAllInvoiceByToken, getAllInvoiceMonthly, getAllInvoiceMonthlys,
    getInvoiceBymonth, updateInvoiceByid
} from '../controller/invoiceController';
const { verifyToken, verifyTokenAdmin, verifyTokenUser } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/invoices/:month/:year', verifyTokenAdmin, getallInvoices);
router.get('/invoice/:id/:month/:year', verifyTokenAdmin, getInvoiceByid);
router.get('/invoiceid/:id', verifyToken, getInvoiceByidInvoice);
router.post('/invoice', verifyTokenAdmin, createInvoice);
router.get('/invoicemonthly', verifyToken, getInvoiceMonthlyByToken);
router.get('/invoiceall', verifyToken, getAllInvoiceByToken);
router.get('/invoicemonthlyall/:month/:year', verifyTokenAdmin, getAllInvoiceMonthly);
router.get('/invoicemonthlysalls/:month/:year', verifyTokenAdmin, getAllInvoiceMonthlys);
router.get('/invoicemonthly/:month/:year', verifyToken, getInvoiceBymonth);
router.put('/invoice/:id', verifyTokenAdmin, updateInvoiceByid);

export default router;

