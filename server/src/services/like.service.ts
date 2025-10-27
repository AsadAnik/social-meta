import { Like, Post } from '../models';
import mongoose from 'mongoose';
import NotificationService from './notification.service';
import { INotification } from '../models/Notification';

class LikeService {
    private readonly likeModelRepository: typeof Like;
    private readonly postModelRepository: typeof Post;
    private readonly notificationService: NotificationService;

    constructor(likeModelRepository: typeof Like = Like, postModelRepository: typeof Post = Post) {
        this.likeModelRepository = likeModelRepository;
        this.postModelRepository = postModelRepository;
        this.notificationService = new NotificationService();
    }

    /**
     * TOGGLE LIKE SERVICE
     * Aggregates the like data with user info from the database.
     * Joined the user info to the like data. with the help of $lookup.
     * with $project we can select the fields we want to return.
     * with $unwind we can unwind the array.
     * with $match  we can filter the data.
     * @param postId
     * @returns
     */
    // region Get Post Likes
    public async getPostLikes(postId: string, page: number = 1, limit: number = 10): Promise<any[]> {
        try {
            const skip = (page - 1) * limit;

            // Fetch likes with pagination and aggregation
            const likes = await this.likeModelRepository.aggregate([
                { $match: { postId: new mongoose.Types.ObjectId(postId) } },
                {
                    $lookup: { // Populate/Join the user info
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user' // unwind the user array
                },
                {
                    $project: { // select the fields we want to return
                        user: {
                            firstname: '$user.firstname',
                            lastname: '$user.lastname',
                            email: '$user.email',
                            profilePhoto: '$user.profilePhoto'
                        },
                        createdAt: 1,
                        updatedAt: 1,
                        _id: 0
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $facet: { // Use $facet to group multiple pipelines
                        data: [
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        total: [ // total number of likes
                            { $count: 'total' }
                        ]
                    }
                }
            ]);

            return likes;

        } catch (error) {
            console.error(`Error in getPostLikes service: ${error}`);
            throw error;
        }
    }


    /**
     * LIKE POST SERVICE
     * Not using this becuase of scalability issue on large data set.
     * We are using the getPostLikes() service instead.
     * @param postId
     * @returns {Promise<[]>}
     */
    // region Get Post Likes Old
    public async getPostLikesOld(postId: string): Promise<any[]> {
        try {
            const likes = await this.likeModelRepository.find({ postId })
                .populate('userId', 'firstname lastname email profilePhoto');

            // Extract data from the populated likes
            const likesData = likes?.map(like => {
                return {
                    user: like.userId,
                    createdAt: like.createdAt,
                    updatedAt: like.updatedAt
                };
            })

            return likesData;

        } catch (error) {
            console.error(`Error in getPostLikes service: ${error}`);
            throw error;
        }
    }

    /**
     * TOGGLE LIKE SERVICE
     * @param userId
     * @param postId
     * @returns {Promise<{ success: boolean, message: string, likeStatus: boolean }>}
     */
    // region Toggle Like/Dislike
    public async toggleLike(userId: string, postId: string, io: any): Promise<{
        success: boolean,
        message: string,
        likeStatus: boolean
    }> {
        try {
            const existingLike = await this.likeModelRepository.findOne({ userId, postId });
            if (existingLike !== null && existingLike) {
                // Dislike the post..
                const dislikeThePost = await this.dislikePost(userId, postId);
                await this.notificationService.deleteNotification({ senderId: userId, postId, type: 'like' });
                return dislikeThePost;

            } else {
                // Like the post..
                const likeThePost = await this.likePost(userId, postId);
                const post = await this.postModelRepository.findById(postId);

                // Send notification to the post owner if the user is not the owner of the post.
                if (post && post?.user?.toString() !== userId) {
                    const notification = await this.notificationService.createNotification({
                        recipientId: post.user?.toString(),
                        senderId: userId,
                        postId,
                        type: 'like',
                        message: 'Someone liked your post.'
                    } as INotification);

                    // Emit real-time notification to the recipient
                    // region Socket Send TO-IO
                    io.to(post.user?.toString()).emit('notification', {
                        message: notification.message,
                        postId: notification.postId?.toString(),
                        recipientId: notification.recipientId?.toString(),
                        senderId: userId?.toString(),
                        type: notification.type,
                        createdAt: notification.createdAt?.toString()
                    });
                }

                return likeThePost;
            }

        } catch (error) {
            console.error(`Error in toggleLike service: ${error}`);
            throw error;
        }
    }

    /**
     * LIKE POST SERVICE (Private)
     * @param userId
     * @param postId
     * @returns
     */
    // region Like Post
    private async likePost(userId: string, postId: string): Promise<{
        success: boolean,
        message: string,
        likeStatus: boolean
    }> {
        try {
            const newLike = new this.likeModelRepository({ userId, postId });
            await newLike.save();
            await this.postModelRepository.findByIdAndUpdate(postId, {
                $inc: { likes_count: 1 }
            });

            return { success: true, message: "Post liked.", likeStatus: true };

        } catch (error) {
            console.error(`Error in likePost service: ${error}`);
            throw error;
        }
    }

    /**
     * DISLIKE POST SERVICE (Private)
     * @param userId
     * @param postId
     * @returns
     */
    // region Dislike Post
    private async dislikePost(userId: string, postId: string): Promise<{
        success: boolean,
        message: string,
        likeStatus: boolean
    }> {
        try {
            await this.likeModelRepository.deleteOne({ userId, postId });
            await this.postModelRepository.updateOne({ _id: postId, likes_count: { $gt: 0 } }, {
                $inc: { likes_count: -1 }
            });

            return { success: true, message: "Post disliked.", likeStatus: false };

        } catch (error) {
            console.error(`Error in dislikePost service: ${error}`);
            throw error;
        }
    }
}

export default LikeService;
