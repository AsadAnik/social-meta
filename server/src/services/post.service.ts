import { Post } from "../models";
import { BlobStorageUtils } from '../lib/shared';

class PostService {
  private readonly postModelRepository: typeof Post;

  constructor(userModelRepository: typeof Post = Post) {
    this.postModelRepository = userModelRepository;
  }

  /**
   * UPLOAD IMAGE FOR POST SERVICE
   * This is for post-service upload and internal function.
   * @param file
   * @param dirName
   * @returns
   */
  private async uploadImage<T>(file: any, dirName: string = "post_upload"): Promise<T> {
    try {
      const uploaded_secure_url = await BlobStorageUtils.uploadImage(file, dirName);
      return uploaded_secure_url as T;

    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload image!");
    }
  }

  /**
   * READ POST SERVICE
   * This is for reading an individual post
   * @param postId
   * @returns
   */
  // region Read Post
  public async readPost(postId: string): Promise<any> {
    try {
      console.log('POST ID - ', postId);
      const post = await this.postModelRepository
        .findById(postId)
        .populate(
          "user",
          "firstname lastname profilePhoto title themeMode colorMode email"
        )
        .exec();

      if (!post) throw new Error("Post not found!");
      return post;
    } catch (error) {
      console.error("Failed to read post:", error);
      throw new Error("Failed to read post");
    }
  }

  /**
   * FETCH ALL POSTS SERVICE
   * This is the optimized way of fetching all posts
   * We used aggregate which is better for large set of data fetching
   * Usefull for pagination, searching, filtering, and sorting and also relationships
   * @param page
   * @param limit
   */
  // region Get All Posts
  public async fetchAllPosts(page: number = 1, limit: number = 5) {
    try {
      const skip = (page - 1) * limit;
      const [result] = await this.postModelRepository.aggregate([
        {
          $match: {
            ownerId: { $ne: null } // Filterout null owners at database level
          }
        },
        {
          $addFields: { ownerId: { $toObjectId: "$ownerId" } }
        },
        {
          $facet: { // facet for grouping multiple pipelines
            metadata: [
              { $count: "total" } // Getting total data
            ],
            posts: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              {
                $lookup: { // Populate/Join user model
                  from: 'users',
                  localField: 'ownerId',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: { // Select fields from user
                        firstname: 1,
                        lastname: 1,
                        email: 1,
                        title: 1,
                        profilePhoto: 1,
                      }
                    }
                  ],
                  as: 'owner'
                }
              },
              {
                $unwind: { // Unwind owner array
                  path: "$owner",
                  preserveNullAndEmptyArrays: true // Prevents filtering out posts without an owner
                }
              }
            ]
          }
        }
      ]);

      // Calculate pagination metadata
      const total = result.metadata[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        posts: result.posts,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        page,
        limit,
      };

    } catch (error) {
      console.error("Failed to fetch all posts:", error);
      throw new Error("Failed to fetch all posts");
    }
  }

  /**
   * READ ALL POSTS SERVICE
   * No Longer Used (using fetchAllPosts instead)
   * This is for reading all posts
   * @param page = 1 (Default)
   * @param limit = 5 (Default)
   */
  // region Read All Posts
  public async readAllPostsOld(page: number = 1, limit: number = 5): Promise<any> {
    try {
      const posts = await this.postModelRepository
        .find({})
        .populate({
          path: "ownerId",
          model: "User",
          select: "firstname lastname profilePhoto email title",
        })
        .sort([["createdAt", -1]])
        .skip((page - 1) * limit)
        .limit(limit);

      // Filter out posts where `ownerId` is null (user no longer exists)
      const filteredPosts = posts.filter((post) => post.ownerId !== null);

      // Count the total number of valid posts for pagination
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        posts: filteredPosts,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        page,
        limit,
      };

    } catch (error) {
      console.error("Failed to read all posts:", error);
      throw new Error("Failed to read all posts");
    }
  }

  /**
   * READ SPECIFIC USER POSTS SERVICE
   * This is for reading all posts of a specific user
   * @param userId
   */
  // region Specific User Posts
  public async specificUserPosts(userId: string, page: number = 1, limit: number = 5): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const [result] = await this.postModelRepository.aggregate([
        {
          $match: {
            ownerId: { $eq: userId }, // Filter by userId
          }
        },
        {
          $addFields: { ownerId: { $toObjectId: "$ownerId" } } // Convert ownerId to ObjectId
        },
        {
          $facet: {
            metadata: [ // facet for grouping multiple pipelines
              { $count: "total" } // Count total documents
            ],
            posts: [
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              {
                $lookup: { // Populate/Join user model
                  from: 'users',
                  localField: 'ownerId',
                  foreignField: '_id',
                  pipeline: [
                    {
                      $project: { // Select fields from user
                        firstname: 1,
                        lastname: 1,
                        email: 1,
                        title: 1,
                        profilePhoto: 1,
                      }
                    }
                  ],
                  as: 'owner'
                }
              },
              {
                $unwind: { // Unwind owner array
                  path: "$owner",
                  preserveNullAndEmptyArrays: true // Prevents filtering out posts without an owner
                }
              }
            ]
          }
        }
      ]);

      // Calculate pagination metadata
      const total = result.metadata[0]?.total || 0;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        posts: result.posts,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        page,
        limit,
      };

    } catch (error) {
      console.error("Failed to read specific user posts:", error);
      throw new Error("Failed to read specific user posts");
    }
  }

  /**
   * CREATE POST SERVICE
   * This is for creating a new post
   * @param post
   */
  // region Create Post
  public async createPost(post: any): Promise<any> {
    try {
      if (post.image) {
        const uploadedImageUrl = await this.uploadImage<string>(post.image);
        post.image = uploadedImageUrl;
      } else {
        delete post.image;
      }

      const newPost = await this.postModelRepository.create(post);
      return await newPost.save();

    } catch (error) {
      console.error("Failed to create post:", error);
      throw new Error("Failed to create post");
    }
  }

  /**
   * UPDATE POST SERVICE
   * This is for updating a post
   * @param postId
   * @param updatedPost
   */
  // region Update Post
  public async updatePost(postId: string, postData: any): Promise<any> {
    try {
      if (postData.image) {
        const uploadedImageUrl = await this.uploadImage<string>(postData.image);
        postData.image = uploadedImageUrl;
      } else {
        delete postData.image;
      }

      const updatedPost = await this.postModelRepository.findByIdAndUpdate(postId, postData, { new: true });
      if (!updatedPost) throw new Error("Post not found!");
      return updatedPost;

    } catch (error) {
      console.error("Failed to update post:", error);
      throw new Error("Failed to update post");
    }
  }

  /**
   * DELETE POST SERVICE
   * This is for deleting a post
   * @param postId
   */
  // region Delete Post
  public async deletePost(postId: string): Promise<any> {
    try {
      const deletedPost = await this.postModelRepository.findByIdAndDelete(postId);
      if (!deletedPost) throw new Error("Post not found!");
      return deletedPost;

    } catch (error) {
      console.error("Failed to delete post:", error);
      throw new Error("Failed to delete post");
    }
  }
}

export default PostService;
