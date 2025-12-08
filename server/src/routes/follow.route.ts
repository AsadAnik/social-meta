import express from 'express';
import { FollowController } from '../controllers';

const router = express.Router();

// Object instance for FollowController Class..
const followController = new FollowController();

/**
 * ---- Make Follow ----
 * When you send follow Request
 */
// region POST /follow
router.post('/follow', followController.sendFollowRequest);

/**
 * ---- Accept Follow ----
 * When you accept follow Request
 */
// region POST /accept-follow
router.post('/accept-follow', followController.acceptFollowRequest);

/**
 * ---- Reject Follow ----
 */
// region POST /reject-follow
router.post('/reject-follow', followController.rejectFollowRequest);

/**
 * ---- Unfollow User ----
 * When you unfollow any User
 */
// region POST /unfollow
router.post('/unfollow', followController.unfollowUser);

/**
 * ---- Follow Request ----
 * When you want to see your follow requests
 */
// region GET /follow-request
router.get('/follow-requests', followController.followRequest);

/**
 * ---- Get Followers ----
 * When you want to see your followers
 */
// region GET /followers?page=1&limit=10
router.get('/:userId/followers', followController.getfollowers);

/**
 * ---- Get Followings ----
 * When you want to see your followings
 */
// region GET /followings?page=1&limit=10
router.get('/:userId/followings', followController.getFollowings);

export default router;