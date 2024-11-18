const Post = require('../models/post');


/**
 * ---- Update Post Like ----
 * @param {*} req 
 * @param {*} res 
 */
exports.likePost = function (req, res) {
    const postId = req.query.postId;
    const likes = req.query.likes;
    const post = new Post(req.body);

    // Adding like...
    post.likes = likes;

    Post.findByIdAndUpdate({ _id: postId }, post, { new: true })
        .then(docs => {
            res.status(200).json({
                success: true,
                likes: docs.likes
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                err
            });
        });
};


/**
 * ---- Get Post Like ----
 * @param {*} req 
 * @param {*} res 
 */
exports.getLikes = function (req, res) {
    const postId = req.query.postId;

    Post.findById({ _id: postId }, (err, post) => {
        if (err) return res.json({ success: false, err });
        if (!post) return res.json({ success: false, message: 'Post not found!' });

        res.status(200).json({
            success: true,
            likes: post.likes
        });
    });
};


/**
 * ---- Read Post ----
 * @param {*} req 
 * @param {*} res 
 */
exports.readPost = function (req, res) {
    const postId = req.query.postId;

    // find Post by PostId.
    Post.find({ _id: postId })
        .populate("user", "firstname lastname profilePhoto title themeMode colorMode email")
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'user',
                model: 'User',
                select: 'firstname lastname profilePhoto title themeMode colorMode email'
            }
        })
        .exec((err, post) => {
            if (err) return res.json({ success: false, err });
            if (!post) return res.json({ success: false, message: 'Post not found!' });

            res.status(200).json({
                success: true,
                post
            });
        });
};


/**
 * ---- Read all posts with pagination ----
 * @param {*} req 
 * @param {*} res 
 */
exports.readAllPosts = async function (req, res) {
    try {
        const { page = 1, limit = 5 } = req.query;
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch posts with populated user, filtering out those with non-existent users
        const posts = await Post.find({})
            .populate({
                path: 'ownerId',
                model: 'User',
                select: 'firstname lastname profilePhoto email title',
                match: { _id: { $exists: true } },
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'firstname lastname profilePhoto email title',
                    match: { _id: { $exists: true } },
                },
            })
            .sort([['createdAt', -1]])
            .skip(skip)
            .limit(limitNumber);

        // Filter out posts where `ownerId` is null (user no longer exists)
        const filteredPosts = posts.filter(post => post.ownerId !== null);

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
};



/**
 * ---- Posts by OwnerId (Current User's Post) ----
 * @param {*} req 
 * @param {*} res 
 */
exports.currentUserPosts = function (req, res) {
    const currentLoggedInUserId = String(req.user._id);

    Post.find({ ownerId: currentLoggedInUserId })
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'user',
                model: 'User',
                select: 'firstname lastname profilePhoto title themeMode colorMode email username'
            }
        })
        .sort([['createdAt', -1]])
        .exec((err, docs) => {
            if (err) return res.status(400).send(err);
            res.status(200).send(docs);
        });
};


/**
 * ---- Showing specific User Posts ----
 * @param {*} req 
 * @param {*} res 
 */
exports.specificUserPosts = function (req, res) {
    const userId = req.query.userId;

    Post.find({ ownerId: userId }).populate('comments').exec((err, docs) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(docs);
    });
};


/**
 * ---- Create new Post ----
 * @param {*} req 
 * @param {*} res 
 */
exports.createPost = function (req, res) {
    const post = new Post(req.body);

    const currentLoggedInUserId = String(req.user._id);
    // post.set('ownerId', currentLoggedInUserId);
    post.ownerId = currentLoggedInUserId;
    post.user = currentLoggedInUserId;

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
        post.image = req.file.originalname;
    }

    post.save(function (error, docs) {
        if (error) return res.json({ success: false, error });
        res.status(200).json({
            success: true,
            docs
        });
    });
};

/**
 * ---- Update Post ----
 * @param {*} req 
 * @param {*} res 
 */
exports.updatePost = function (req, res) {
    const id = req.body._id;
    const post = new Post(req.body);

    // if there is new post image update file to make it up..
    // and if no new update image file so don't need update extra..
    if (req.file !== undefined) {
        post.image = req.file.originalname;
    }

    Post.findByIdAndUpdate({ _id: id }, post, { new: true }).then(docs => {
        res.status(200).json({
            success: true,
            docs
        });
    }).catch(err => {
        res.status(400).json({
            success: false,
            err
        });
    });
};


/**
 * ---- Delete Post ----
 * @param {*} req 
 * @param {*} res 
 */
exports.deletePost = function (req, res) {
    const id = req.query.id;

    Post.findByIdAndDelete(id, (err) => {
        if (err) return res.status(400).json({ deleted: false, err });
        res.status(200).json({
            deleted: true
        });
    });
};
