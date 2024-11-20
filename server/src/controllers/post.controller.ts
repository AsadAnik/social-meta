import { Request, Response } from "express";
import Post from "../models/Post";
import { Types } from "mongoose";

class PostController {
  /**
   * LIKE POST CONTROLLER
   * @param req
   * @param res
   */
  public async likePost(req: Request, res: Response) {
    const postId = req.query.postId;
    const likes = req.query.likes;
    const post = new Post(req.body);

    // Adding like...
    post.likes = likes ? parseInt(String(likes), 10) : 0;

    try {
      const docs = await Post.findByIdAndUpdate({ _id: postId }, post, {
        new: true,
      });
      res.status(200).json({
        success: true,
        likes: docs ? docs.likes : 0,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        err,
      });
    }
  }

  /**
   * GET LIKES CONTROLLER
   * @param req
   * @param res
   * @returns
   */
  public async getLikes(req: Request | any, res: Response | any) {
    const postId = req.query.postId;

    try {
      const post = await Post.findById({ _id: postId });
      if (!post)
        return res.json({ success: false, message: "Post not found!" });

      res.status(200).json({
        success: true,
        likes: post.likes,
      });
    } catch (err) {
      res.json({ success: false, error: err });
    }
  }

  /**
   * READ POST CONTROLLER
   * @param req
   * @param res
   * @returns
   */
  public async readPost(req: Request | any, res: Response | any) {
    const postId = req.query.postId;

    // find Post by PostId.
    try {
      const post = await Post.find({ _id: postId })
        .populate(
          "user",
          "firstname lastname profilePhoto title themeMode colorMode email"
        )
        .populate({
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "user",
            model: "User",
            select:
              "firstname lastname profilePhoto title themeMode colorMode email",
          },
        })
        .exec();

      if (!post)
        return res.json({ success: false, message: "Post not found!" });

      res.status(200).json({
        success: true,
        post,
      });
    } catch (err) {
      res.json({ success: false, err });
    }
  }

  /**
   * READ ALL POSTS CONTROLLER
   * @param req
   * @param res
   */
  public async readAllPosts(_req: Request, res: Response) {
    try {
      const { page = 1, limit = 5 } = _req.query;
      const pageNumber = Math.max(1, Number(page));
      const limitNumber = Math.max(1, Number(limit));
      const skip = (pageNumber - 1) * limitNumber;

      // Fetch posts with populated user, filtering out those with non-existent users
      const posts = await Post.find({})
        .populate({
          path: "ownerId",
          model: "User",
          select: "firstname lastname profilePhoto email title",
          match: { _id: { $exists: true } },
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
            model: "User",
            select: "firstname lastname profilePhoto email title",
            match: { _id: { $exists: true } },
          },
        })
        .sort([["createdAt", -1]])
        .skip(skip)
        .limit(limitNumber);

      // Filter out posts where `ownerId` is null (user no longer exists)
      const filteredPosts = posts.filter((post) => post.ownerId !== null);

      // Count the total number of valid posts for pagination
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / limitNumber);
      const hasNextPage = pageNumber < totalPages;

      res.status(200).json({
        success: true,
        posts: filteredPosts,
        total,
        totalPages,
        hasNextPage,
        page: pageNumber,
        limit: limitNumber,
      });
    } catch (error) {
      res.status(500).json({ success: false, error });
    }
  }

  /**
   * CURRENT USER POSTS CONTROLLER
   * @param req
   * @param res
   */
  public async currentUserPosts(req: Request, res: Response) {
    const currentLoggedInUserId = String((req as any).user?._id);

    try {
      const posts = await Post.find({ ownerId: currentLoggedInUserId })
        .populate({
          path: "comments",
          model: "Comment",
          options: {
            sort: {
              createdAt: -1,
            },
          },
          populate: {
            path: "user",
            model: "User",
            select:
              "firstname lastname profilePhoto title themeMode colorMode email",
          },
        })
        .sort([["createdAt", -1]])
        .exec();

      res.status(200).send(posts);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  /**
   * GET SPECIFIC USER POST CONTROLLER
   * @param req
   * @param res
   */
  public async specificUserPosts(req: Request, res: Response) {
    const userId = req.query.userId;

    try {
      const posts = await Post.find({ ownerId: userId })
        .populate("comments")
        .exec();
      res.status(200).send(posts);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  /**
   * CREATE POST CONTROLLER
   * @param req
   * @param res
   */
  public async createPost(req: Request, res: Response) {
    const post = new Post(req.body);

    const currentLoggedInUserId = String((req as any).user._id);
    post.ownerId = currentLoggedInUserId;
    post.user = new Types.ObjectId(currentLoggedInUserId);

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
      post.image = req.file.originalname;
    }

    try {
      const docs = await post.save();
      res.status(200).json({
        success: true,
        docs,
      });
    } catch (error) {
      res.json({ success: false, error });
    }
  }

  /**
   * UPDATE POST CONTROLLER
   * @param req
   * @param res
   */
  public async updatePost(req: Request, res: Response) {
    const id = req.body._id;
    const post = new Post(req.body);

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
      post.image = req.file.originalname;
    }

    try {
      const docs = await Post.findByIdAndUpdate({ _id: id }, post, {
        new: true,
      });
      res.status(200).json({
        success: true,
        docs,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        err,
      });
    }
  }

  /**
   * DELETE POST CONTROLLER
   * @param req
   * @param res
   */
  public async deletePost(req: Request, res: Response) {
    const id = req.query.id;

    try {
      await Post.findByIdAndDelete(id);
      res.status(200).json({
        deleted: true,
      });
    } catch (err) {
      res.status(400).json({ deleted: false, err });
    }
  }
}

export default PostController;
