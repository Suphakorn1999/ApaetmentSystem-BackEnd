import { Router } from 'express';
import { getCountAll, getmonthlyincome, getCountBadge } from '../controller/dataController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/countall', verifyToken, getCountAll);
router.get('/monthlyincome', verifyToken, getmonthlyincome);
router.get('/countbadge', verifyToken, getCountBadge);

export default router;