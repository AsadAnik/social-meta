import { FollowerFollowing } from '../models';
import NotificationService from './notification.service';
import UserService from './user.service';
import { INotification } from '../models/Notification';
import mongoose from 'mongoose';

class FollowService {
    private readonly followerFollowingModelRepository: typeof FollowerFollowing;
    private readonly notificationService: NotificationService;
    private readonly userService: UserService;

    constructor(followerFollowingModelRepository: typeof FollowerFollowing = FollowerFollowing) {
        this.followerFollowingModelRepository = followerFollowingModelRepository;
        this.notificationService = new NotificationService();
        this.userService = new UserService();
    }

    /**
     * SEND FOLLOW REQUEST TO USER
     * This is responsible for sending the follow request to another user
     * @param followerId 
     * @param followingId 
     * @param io 
     */
    // region Send Follow Request
    public async sendFollowRequest(followerId: string, followingId: string, io: any) {
        try {
            // Check is follow request already exists
            const existingRequest = await this.followerFollowingModelRepository.findOne({
                followerId,
                followingId
            });
            if (existingRequest) throw new Error('Follow request already sent or already following');

            // Create follow request
            await this.followerFollowingModelRepository.create({ followerId, followingId, status: 'pending' });

            // Send Notification and Save to DB for Notification Data save..
            // const notification = await this.notificationService.createNotification({
            //     recipientId: followingId,
            //     senderId: followerId,
            //     type: "follow_request",
            //     message: "You got a recent follower!"
            // } as INotification);

            // region Socket IO-TO 
            // io.to(followerId.toString()).emit('notification', {
            //     message: notification.message,
            //     senderId: followerId,
            //     followingId,
            //     type: notification.type,
            //     createdAt: notification.createdAt,
            // });

            return { success: true, message: 'Follow request sent' };

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    };

    /**
     * ACCEPT FOLLOW REQUEST
     * This is for accepting the follow request
     * @param followingId 
     * @param followerId 
     * @param io 
     * @returns 
     */
    // region Accept Follow Request
    public async acceptFollowRequest(followingId: string, followerId: string, io: any) {
        try {
            // Check if request exits
            const followRequest = await this.followerFollowingModelRepository.findOne({
                followerId,
                followingId,
                status: 'pending'
            });
            if (!followRequest) throw new Error('Follow request not found');

            // Update follow request status to 'accepted'
            await this.followerFollowingModelRepository.findByIdAndUpdate(followRequest._id, {
                status: 'accepted'
            });

            // Update user follow counts
            await this.userService.updateUserInfo(followerId, { $inc: { followings_count: 1 } });
            await this.userService.updateUserInfo(followingId, { $inc: { followers_count: 1 } });

            // Send notificaiton to follower.
            // const notification = await this.notificationService.createNotification({
            //     recipientId: followerId,
            //     senderId: followingId,
            //     type: "follow_accept",
            //     message: "Your follow request was accepted!",
            // } as INotification);

            // region Socket IO-TO
            // io.to(followingId.toString()).emit('notification', {
            //     message: notification.message,
            //     senderId: followingId,
            //     followerId,
            //     type: notification.type,
            //     createdAt: notification.createdAt
            // });

            return { success: true, message: 'Follow request accepted' };

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    };

    /**
     * REJECT FOLLOW REQUEST
     * This is responsible for rejecting the follow request
     * @param userId 
     * @param requesterId 
     * @returns 
     */
    // region Reject Follow Request
    public async rejectFollowRequest(userId: string, requesterId: string, io: any) {
        try {
            // Find and delete the follow request (if exists)
            const followRequest = await this.followerFollowingModelRepository.findOneAndDelete({
                followerId: requesterId,
                followingId: userId,
                status: 'pending'
            });
            if (!followRequest) throw new Error('Follow request not found or already handled');

            // Send notification for Rejected
            // const notification = await this.notificationService.createNotification({
            //     recipientId: requesterId,
            //     senderId: userId,
            //     type: "follow_reject",
            //     message: "Your follow request was rejected!",
            // } as INotification);

            // region Socket IO-TO
            // io.to(userId.toString()).emit('notification', {
            //     message: notification.message,
            //     senderId: userId,
            //     type: notification.type,
            //     requesterId,
            //     createdAt: notification.createdAt
            // });

            return { success: true, message: 'Follow request rejected' };

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    };

    /**
     * UNFOLLOW USER
     * This is responsible for unfollow the user
     * @param followingId 
     * @param followerId 
     */
    // region UnFollow User
    public async unfollowUser(followingId: string, followerId: string) {
        try {
            // Remove follow relationship..
            const deleted = await this.followerFollowingModelRepository.findOneAndDelete({
                followerId,
                followingId,
                status: 'accepted'
            });
            if (!deleted) throw new Error('Follow relationship not found');

            // Update user follow counts..
            await this.userService.updateUserInfo(followingId, { $inc: { followers_count: -1 } });
            await this.userService.updateUserInfo(followerId, { $inc: { followings_count: -1 } });

            return { success: true, message: 'Unfollowed successfully' };

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    };

    /**
     * GET FOLLOW REQUESTS
     * @param userId
     * @param type - 'sent' or 'received'
     * @param page
     * @param limit
     */
    // region Follow Request
    public async followRequest(userId: string, type: 'sent' | 'received' = 'received', page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const matchField = type === 'sent' ? 'followerId' : 'followingId';
            const lookupField = type === 'sent' ? 'followingId' : 'followerId';
            const asField = type === 'sent' ? 'following' : 'follower';

            const followRequests = await this.followerFollowingModelRepository.aggregate([
                {
                    $match: {
                        [matchField]: new mongoose.Types.ObjectId(userId),
                        status: 'pending'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: lookupField,
                        foreignField: '_id',
                        as: asField
                    }
                },
                { $unwind: `$${asField}` },
                {
                    $project: {
                        _id: `$${asField}._id`,
                        firstname: `$${asField}.firstname`,
                        lastname: `$${asField}.lastname`,
                        email: `$${asField}.email`,
                        profilePhoto: `$${asField}.profilePhoto`,
                        requestedAt: '$createdAt'
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]);

            return followRequests;

        } catch (error) {
            console.log(`Error occured while follow requests check: ${error}`);
            throw error;
        }
    }

    /**
     * GET FOLLOWERS
     * This is responsible for getting the followers of the user
     * @param userId
     * @param page
     * @param limit
     */
    // region Get Followers
    public async getFollowers(userId: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const followers = await this.followerFollowingModelRepository.aggregate([
                {
                    $match: {
                        followingId: new mongoose.Types.ObjectId(userId),
                        status: 'accepted'
                    }
                },
                {
                    $lookup: { // Populate/Join the user info
                        from: 'users',
                        localField: 'followerId',
                        foreignField: '_id',
                        as: 'follower'
                    }
                },
                { $unwind: '$follower' }, // unwind the user array
                {
                    $project: { // select the fields we want to return
                        _id: '$follower._id',
                        firstname: '$follower.firstname',
                        lastname: '$follower.lastname',
                        email: '$follower.email',
                        profilePhoto: '$follower.profilePhoto',
                        followedAt: '$createdAt'
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]);

            return followers;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    };

    /**
     * GET FOLLOWINGS
     * This is responsible for getting the followings of the user
     * @param userId
     * @param page
     * @param limit
     */
    // region Get Followings
    public async getFollowings(userId: string, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const followings = await this.followerFollowingModelRepository.aggregate([
                {
                    $match: {
                        followerId: new mongoose.Types.ObjectId(userId),
                        status: 'accepted'
                    },
                },
                {
                    $lookup: { // Populate/Join the user info
                        from: 'users',
                        localField: 'followingId',
                        foreignField: '_id',
                        as: 'following'
                    }
                },
                { $unwind: '$following' },
                {
                    $project: { // Select the fields we want to return
                        _id: '$following._id',
                        firstname: '$following.firstname',
                        lastname: '$following.lastname',
                        email: '$following.email',
                        profilePhoto: '$following.profilePhoto',
                        followedAt: '$createdAt'
                    }
                },
                { $skip: skip },
                { $limit: limit }
            ]);

            return followings;

        } catch (error) {
            console.error(`Error occcured while register user: ${error}`);
            throw error;
        }
    };
}

export default FollowService;