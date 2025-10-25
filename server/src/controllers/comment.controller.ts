import { NextFunction, Request, Response } from 'express';
import { CommentService } from '../services';

class CommentController {
    private readonly commentService: CommentService;

    constructor() {
        this.commentService = new CommentService();
    }

    /**
     * ---- Get/Read Comments ----
     * @param {Request} req
     * @param {Response} res
     */
    public async getComments(req: Request, res: Response, next: NextFunction) {
        const postId: string = req.params.postId;
        const { page, limit } = req.query;

        if (!postId) {
            throw new Error('Post ID is required');
        }

        try {
            // Fetch comments from the service
            const comments = await this.commentService.fetchComments(postId, Number(page), Number(limit));
            if (!comments || comments.length === 0) {
                res.status(404).json({ success: false, message: 'No comments found' });
            }

            res.status(200).json(comments);

        } catch (error) {
            res.status(400).json(error);
        }
    }

    /**
     * ---- Create Comment ----
     * @param {Request} req
     * @param {Response} res
     */
    public async createComment(req: Request, res: Response) {
        const { postId, comment } = req.body;
        const userId = (req as any).user._id;
        const io = (req as any).io;

        if (!postId || !comment) {
            throw new Error('Post ID and comment are required');
        }

        try {
            // Create comment in the service
            const savedComment = await this.commentService.createComment(userId, postId, comment, io);
            if (!savedComment) {
                res.status(400).json({ success: false, message: 'Failed to create comment' });
            }

            res.status(200).json(savedComment);

        } catch (error) {
            res.status(400).json({ success: false, error });
        }
    }

    /**
     * ---- Update Comment ----
     * @param {Request} req
     * @param {Response} res
     */
    public async updateComment(req: Request, res: Response) {
        const { commentId, comment } = req.body;

        if (!commentId || !comment) {
            throw new Error('Comment ID and comment are required');
        }

        try {
            // Update comment in the service
            const updatedComment = await this.commentService.updateComment(commentId, comment);
            if (!updatedComment) {
                res.status(400).json({ message: 'Failed to update comment' });
            }

            res.status(200).json(updatedComment);

        } catch (error) {
            res.status(400).json({ success: false, error });
        }
    }

    /**
     * ---- Delete Comment ----
     * @param {Request} req
     * @param {Response} res
     */
    public async deleteComment(req: Request, res: Response) {
        const commentId: string = req.params.commentId;

        if (!commentId) {
            throw new Error('Comment ID is required');
        }

        try {
            // Delete comment in the service
            const deletedComment = await this.commentService.deleteComment(commentId);
            if (!deletedComment) {
                res.status(400).json({ message: 'Failed to delete comment' });
            }

            res.status(200).json(deletedComment);

        } catch (error) {
            res.status(400).json({ deleted: false, error });
        }
    }
}

export default CommentController;
