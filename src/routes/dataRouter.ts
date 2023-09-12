import { Router } from 'express';
import { getCountAll, getmonthlyincomecount, getCountBadge, getmonthlyincome, backupdatabase } from '../controller/dataController';
const { verifyTokenAdmin } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/countall', verifyTokenAdmin, getCountAll);
router.get('/monthlyincomecount', verifyTokenAdmin, getmonthlyincomecount);
router.get('/countbadge', verifyTokenAdmin, getCountBadge);
router.get('/monthlyincome', verifyTokenAdmin, getmonthlyincome);
router.get('/backupdatabase', verifyTokenAdmin, backupdatabase);

export default router;