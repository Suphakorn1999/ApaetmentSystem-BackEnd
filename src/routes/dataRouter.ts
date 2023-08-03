import { Router } from 'express';
import { getCountAll } from '../controller/dataController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/countall', verifyToken, getCountAll);

export default router;