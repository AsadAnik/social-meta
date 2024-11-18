const Comment = require('../models/comment');
const Post = require('../models/post');


/**
 * ---- Read Comments ----
 * @param {*} req 
 * @param {*} res 
 */
exports.readComment = function(req, res){
    // const postId = req.params.postId;
    const postId = req.query.postId;

    Comment.find({ postId }).sort([['createdAt', -1]])
        .populate('user', '-_id -password -createdAt -updatedAt -__v -token')
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(error => {
            res.status(400).json(error);
        });
};


/**
 * ---- Create Comment ----
 * @param {*} req 
 * @param {*} res 
 */
exports.createComment = async function(req, res){
    const comment = new Comment(req.body);
    const postId = req.body.postId;

    // currentLoggedInUserId
    const currentLoggedInUserId = req.user._id;
    comment.user = currentLoggedInUserId;
    // Also can do like this..
    // comment.set('ownerId', currentLoggedInUserId);

    // postId for comment object..
    comment.post = postId;

    // Pushing comments into Post DB with ref.
    await Post.updateOne({ _id: postId }, {
        $push: {
            comments: comment._id
        }
    }, {new: true});

    // Let's save the DB operations.
    comment.save(function(error, docs){
        if (error) return res.json({ success: false, error });

        res.status(200).json({
            success: true,
            docs
        });
    });
};


/**
 * ---- Update Comment ----
 * @param {*} req 
 * @param {*} res 
 */
exports.updateComment = function(req, res){
    const id = req.body._id;
    const comment = new Comment(req.body);

    Comment.findByIdAndUpdate({ _id: id }, comment, { new: true }).then(docs => {
        res.status(200).json({
            success: true,
            docs
        });
    }).catch(error => {
        res.status(400).json({
            success: false,
            error
        });
    });
};


/**
 * ---- Delete Comment ----
 * @param {*} req 
 * @param {*} res 
 */
exports.deleteComment = function(req, res){
    const id = req.query.id;

    Comment.findByIdAndDelete(id, function(error){
        if (error) return res.status(400).json({ deleted: false, error });

        res.status(200).json({
            deleted: true
        });
    });
};
