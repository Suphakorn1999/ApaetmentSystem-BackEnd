import { Router } from 'express';
import { getCountAll, getmonthlyincomecount, getCountBadge, getmonthlyincome, backupdatabase, getStatisticsReport } from '../controller/dataController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/countall', verifyToken, getCountAll);
router.get('/monthlyincomecount', verifyToken, getmonthlyincomecount);
router.get('/countbadge', verifyToken, getCountBadge);
router.get('/monthlyincome', verifyToken, getmonthlyincome);
router.get('/backupdatabase', verifyToken, backupdatabase);
router.get('/statisticsreport', verifyToken, getStatisticsReport);

export default router;