import { Request, Response, NextFunction } from 'express';
import { FollowService } from '../services';

class FollowController {
    private readonly followService: FollowService;

    constructor() {
        this.followService = new FollowService();
    }

    /**
     * ---- Send Follow Request ----
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public sendFollowRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { followingId } = req.body;
            const followerId = (req as any)?.user._id;
            const io = (req as any)?.io;

            // Send Follow Request from Service
            const sendFollow = await this.followService.sendFollowRequest(followerId, followingId, io);
            if (!sendFollow) {
                return next({ status: 400, message: 'Failed to send follow request' });
            }

            res.status(200).json({ message: 'Follow request sent successfully', sendFollow });

        } catch (error) {
            next({ status: 400, message: error });
        }
    }

    /**
     * ---- Accept Follow Request ----
     * @param req 
     * @param res 
     * @param next 
     */
    public acceptFollowRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { followerId } = req.body;
            const followingId = (req as any)?.user._id;
            const io = (req as any)?.io;

            console.log('FOLLOWING AND FOLLWER - ', followerId, followingId);

            // Accept Follow Request from Service
            const acceptFollowRequest = await this.followService.acceptFollowRequest(followingId, followerId, io);
            if (!acceptFollowRequest) {
                return next({ status: 400, message: 'Failed to accept follow request' });
            }

            res.status(200).json({ message: 'Follow request accepted successfully', acceptFollowRequest });

        } catch (error) {
            next({ status: 400, message: error });
        }
    }

    /**
     * ---- Reject Follow Request ----
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public rejectFollowRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { requesterId } = req.body;
            const userId = (req as any)?.user._id;
            const io = (req as any)?.io;

            // Reject Follow Request from Service
            const rejectFollow = await this.followService.rejectFollowRequest(userId, requesterId, io);
            if (!rejectFollow) {
                return next({ status: 400, message: 'Failed to reject follow request' });
            }

            res.status(200).json({ message: 'Follow request rejected successfully', rejectFollow });

        } catch (error) {
            next({ status: 400, message: error });
        }
    }

    /**
     * ---- Unfollow User ----
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { followerId } = req.body;
            const followingId = (req as any)?.user._id;

            // Unfollow service using..
            const makeUnfollow = await this.followService.unfollowUser(followingId, followerId);
            if (!makeUnfollow) {
                return next({ status: 400, message: 'Failed to unfollow user' });
            }

            res.status(200).json({ message: 'Unfollowed successfully', makeUnfollow });

        } catch (error) {
            next({ status: 400, message: error });
        }
    }

    /**
     * ---- Follow Request ----
     * @param req
     * @param res
     * @param next
     */
    public followRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any)?.user._id || req.params.userId;
            const { page, limit, type } = req.query;

            // Convert page and limit to numbers
            const pageNum = page ? parseInt(page as string) : 1;
            const limitNum = limit ? parseInt(limit as string) : 10;
            const requestType = (type === 'sent' || type === 'received') ? type : 'received';

            const followRequest = await this.followService.followRequest(userId, requestType, pageNum, limitNum);
            if (!followRequest) {
                return next({ status: 400, message: 'Failed to get follow requests' });
            }

            res.status(200).json({ message: 'Follow Requests list fetched successfully', followRequest });

        } catch (error) {
            next({ status: 400, message: error });
        }
    };

    /**
     * ---- Get Followers ----
     * @param req 
     * @param res 
     * @param next 
     */
    public getfollowers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any)?.user._id || req.params.userId;
            const { page, limit } = req.query;

            // Convert page and limit to numbers
            const pageNum = page ? parseInt(page as string) : 1;
            const limitNum = limit ? parseInt(limit as string) : 10;

            // Get Followers from Service
            const followers = await this.followService.getFollowers(userId, pageNum, limitNum);
            if (!followers) {
                return next({ status: 400, message: 'Failed to get followers' });
            }
            res.status(200).json({ message: 'Followers fetched successfully', followers });

        } catch (error) {
            next({ status: 400, message: error });
        }
    }

    /**
     * ---- Get Followings ----
     * @param req 
     * @param res 
     * @param next 
     */
    public getFollowings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any)?.user._id || req.params.userId;
            const { page, limit } = req.query;

            // Convert page and limit to numbers
            const pageNum = page ? parseInt(page as string) : 1;
            const limitNum = limit ? parseInt(limit as string) : 10;

            // Get Followings from Service
            const followings = await this.followService.getFollowings(userId, pageNum, limitNum);
            if (!followings) {
                return next({ status: 400, message: 'Failed to get followings' });
            }
            res.status(200).json({ message: 'Followers fetched successfully', followings });

        } catch (error) {
            next({ status: 400, message: error });
        }
    }
}

export default FollowController;