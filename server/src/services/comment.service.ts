import { Comment, Post } from '../models';
import mongoose from 'mongoose';
import NotificationService from './notification.service';
import { INotification } from '../models/Notification';

class CommentService {
    private readonly commentModelRepository: typeof Comment;
    private readonly postModelRepository: typeof Post;
    private readonly notificationService: NotificationService;

    constructor(commentModelRepository: typeof Comment = Comment, postModelRepository: typeof Post = Post) {
        this.commentModelRepository = commentModelRepository;
        this.postModelRepository = postModelRepository;
        this.notificationService = new NotificationService();
    }

    /**
     * FETCH COMMENTS SERVICE
     * Aggretation for comments on a post with user info
     * @param postId
     * @param page
     * @param limit
     * @returns
     */
    // region Fetch Comments
    public async fetchComments(postId: string, page: number = 1, limit: number = 10): Promise<any> {
        try {
            // Calculate the number of comments to skip
            const skip = (page - 1) * limit;

            // Fetch comments with pagination
            const comments = await this.commentModelRepository.aggregate([
                { $match: { postId: new mongoose.Types.ObjectId(postId) } },
                {
                    $lookup: { // Populate/Join the user info
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' }, // unwind the user array
                {
                    $project: {
                        user: {
                            firstname: '$user.firstname',
                            lastname: '$user.lastname',
                            email: '$user.email',
                            profilePhoto: '$user.profilePhoto'
                        },
                        createdAt: 1,
                        updatedAt: 1,
                        comment: 1,
                        _id: 0
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $facet: { // use $facet to group the results multiple pipelines
                        data: [
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        total: [
                            { $count: 'total' }
                        ]
                    }
                },
            ]);

            // Extracting Data & Return
            const result = comments[0];
            const total = result.total.length > 0 ? result.total[0].total : 0;
            return { success: true, data: result.data, total };

        } catch (error) {
            console.error(`Error in fetchComments service: ${error}`);
            throw error;
        }
    }

    /**
     * FETCH COMMENTS SERVICE
     * @param postId
     * @param page
     * @param limit
     */
    // region Fetch Comments Old
    public async fetchCommentsOld(postId: string, page: number = 1, limit: number = 10): Promise<any> {
        try {
            // Calculate the number of comments to skip
            const skip = (page - 1) * limit;

            // Fetch comments with pagination
            const comments = await this.commentModelRepository.find({ postId })
                .populate('userId', 'firstname lastname email profilePhoto')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();

            // Extract data from the populated comments
            const commentsData = comments?.map(comment => {
                return {
                    _id: comment._id,
                    user: comment.userId,
                    comment: comment.comment,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt
                };
            });

            return { success: true, comments: commentsData };

        } catch (error) {
            console.error(`Error in fetchComments service: ${error}`);
            throw error;
        }
    }

    /**
     * CREATE COMMENT SERVICE
     * @param userId
     * @param postId
     * @param comment
     * @param io
     * @returns
     */
    // region Create Comment
    public async createComment(userId: string, postId: string, comment: string, io: any): Promise<any> {
        try {
            const newComment = await this.commentModelRepository.create({ userId, postId, comment });
            await this.postModelRepository.findByIdAndUpdate(postId, {
                $inc: { comments_count: 1 }
            });

            const post = await this.postModelRepository.findById(postId);

            // Make a notification for the post owner
            if (post && post.user?.toString() !== userId) {
                await this.notificationService.createNotification({
                    recipientId: post.user?.toString(),
                    senderId: userId,
                    type: 'comment',
                    postId,
                    message: 'Someone commented on your post.',
                } as INotification);

                // Emit the real-time notification to the recepient..
                // region Socket Send TO-IO
                io.to(post.user?.toString()).emit('notification', {
                    recipientId: post.user?.toString(),
                    senderId: userId,
                    type: 'comment',
                    postId,
                    message: 'Someone commented on your post.',
                    comment: newComment,
                });
            }

            return { success: true, message: "Comment created.", comment: newComment };

        } catch (error) {
            console.error(`Error in createComment service: ${error}`);
            throw error;
        }
    }

    /**
     * UPDATE COMMENT SERVICE
     * @param commentId
     */
    // region Update Comment
    public async updateComment(commentId: string, newComment: string): Promise<any> {
        try {
            const comment = await this.commentModelRepository.findById(commentId);
            if (!comment) throw new Error('Comment not found!');

            // Update the comment
            comment.comment = newComment;
            await comment.save();

            return { success: true, message: "Comment updated." };

        } catch (error) {
            console.error(`Error in updateComment service: ${error}`);
            throw error;
        }
    }

    /**
     * DELETE COMMENT SERVICE
     * @param commentId
     */
    // region Delete Comment
    public async deleteComment(commentId: string): Promise<any> {
        try {
            const comment = await this.commentModelRepository.findById(commentId);
            if (!comment) throw new Error('Comment not found!');

            // Delete the comment
            await this.commentModelRepository.deleteOne({ _id: commentId });
            await this.postModelRepository.findByIdAndUpdate(comment.postId, {
                $inc: { comments_count: -1 }
            });

            // Delete the notifications related to this comment
            await this.notificationService.deleteNotification({
                senderId: comment.userId?.toString(),
                postId: comment.postId?.toString(),
                type: 'comment'
            });

            return { success: true, message: "Comment deleted." };

        } catch (error) {
            console.error(`Error in deleteComment service: ${error}`);
            throw error;
        }
    }
}

export default CommentService;
