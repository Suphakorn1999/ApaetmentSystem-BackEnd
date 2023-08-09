import { Router } from 'express';
import { getThreads, getThread, getPost, getComment, createThread, createPost, createComment, updateThread, updatePost, updateComment } from '../controller/webboardController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/threads', verifyToken, getThreads);
router.get('/threads/:id', verifyToken, getThread);
router.get('/posts/:id', verifyToken, getPost);
router.get('/comments/:id', verifyToken, getComment);
router.post('/threads', verifyToken, createThread);
router.post('/posts', verifyToken, createPost);
router.post('/comments', verifyToken, createComment);
router.put('/threads/:id', verifyToken, updateThread);
router.put('/posts/:id', verifyToken, updatePost);
router.put('/comments/:id', verifyToken, updateComment);


export default router;