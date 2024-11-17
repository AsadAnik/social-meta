import express, { Request, Response, NextFunction } from 'express';
import commentController from '../controllers/comment.controller';
import { readComment, createComment, updateComment, deleteComment } from commentController;

const router = express.Router();

/**
 * ---- Read Comments ----
 */
router.get('/read_comment', readComment);

/**
 * ---- Create Comment ----
 */
router.post('/make_comment', createComment);

/**
 * ---- Update Comment ----
 */
router.post('/update_comment', updateComment);

/**
 * ---- Delete Comment ----
 */
router.delete('/comment_delete', deleteComment);

export default router;