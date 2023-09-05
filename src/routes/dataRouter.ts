import { Router } from 'express';
import { getCountAll, getmonthlyincomecount, getCountBadge, getmonthlyincome } from '../controller/dataController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/countall', verifyToken, getCountAll);
router.get('/monthlyincomecount', verifyToken, getmonthlyincomecount);
router.get('/countbadge', verifyToken, getCountBadge);
router.get('/monthlyincome', verifyToken, getmonthlyincome);

export default router;