import { Router } from 'express';
import {
    getThreads, getThread, getPostAndCommentByidthreads, createThread, createPost,
    createComment, updateThread, updatePost, updateComment, getSearchedThread, deleteComment,
    deletePost, deleteThread
} from '../controller/webboardController';
const { verifyToken } = require('../middlewares/jwtHandler');
const router = Router();

router.get('/threads', verifyToken, getThreads);
router.get('/threads/:id', verifyToken, getThread);
router.get('/posts/:id', verifyToken, getPostAndCommentByidthreads);
router.post('/threads', verifyToken, createThread);
router.post('/posts', verifyToken, createPost);
router.post('/comments', verifyToken, createComment);
router.put('/threads/:id', verifyToken, updateThread);
router.put('/posts/:id', verifyToken, updatePost);
router.put('/comments/:id', verifyToken, updateComment);
router.get('/search/:title', verifyToken, getSearchedThread);
router.delete('/comments/:id', verifyToken, deleteComment);
router.delete('/posts/:id', verifyToken, deletePost);
router.delete('/threads/:id', verifyToken, deleteThread);


export default router;