import { Router } from 'express';
import { getCountAll, getmonthlyincome } from '../controller/dataController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/countall', verifyToken, getCountAll);
router.get('/monthlyincome', verifyToken, getmonthlyincome);

export default router;