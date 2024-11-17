import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';

/**
 * ---- Read Comments ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const readComment = async (req: Request, res: Response) => {
    const postId = req.query.postId;

    try {
        const comments = await Comment.find({ postId }).sort([['createdAt', -1]])
            .populate('user', '-_id -password -createdAt -updatedAt -__v -token');

        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json(error);
    }
};

/**
 * ---- Create Comment ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const createComment = async (req: Request, res: Response) => {
    const comment = new Comment(req.body);
    const postId = req.body.postId;
    const currentLoggedInUserId = (req as any).user._id;

    comment.user = currentLoggedInUserId;
    comment.post = postId;

    try {
        await Post.updateOne({ _id: postId }, {
            $push: {
                comments: comment._id
            }
        }, {new: true});

        const savedComment = await comment.save();
        res.status(200).json({
            success: true,
            comment: savedComment
        });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

/**
 * ---- Update Comment ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const updateComment = async (req: Request, res: Response) => {
    const id = req.body._id;
    const comment = new Comment(req.body);

    try {
        const updatedComment = await Comment.findByIdAndUpdate({ _id: id }, comment, { new: true });
        res.status(200).json({
            success: true,
            comment: updatedComment
        });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
};

/**
 * ---- Delete Comment ----
 * @param {Request} req 
 * @param {Response} res 
 */
export const deleteComment = async (req: Request, res: Response) => {
    const id = req.query.id;

    try {
        await Comment.findByIdAndDelete(id);
        res.status(200).json({ deleted: true });
    } catch (error) {
        res.status(400).json({ deleted: false, error });
    }
};
