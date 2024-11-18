import express, { Request, Response, NextFunction } from 'express';
import { CommentController } from '../controllers';

const router = express.Router();

// Object instance for CommentController Class..
const commentController = new CommentController();

/**
 * ---- Read Comments ----
 */
router.get('/read_comment', commentController.readComment);

/**
 * ---- Create Comment ----
 */
router.post('/make_comment', commentController.createComment);

/**
 * ---- Update Comment ----
 */
router.post('/update_comment', commentController.updateComment);

/**
 * ---- Delete Comment ----
 */
router.delete('/comment_delete', commentController.deleteComment);

export default router;