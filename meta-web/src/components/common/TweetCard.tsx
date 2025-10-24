"use client"
import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    IconButton,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import EditPostDialog from './EditModel';
import { useDeletePostMutation, useToggleLikeMutation } from '@/redux/slice/post.slice';
// import { useAddCommentMutation } from '@/redux/slice/comment.slice';
import CommentSection from '../CommentSection';
// import { socket } from '@/lib/socket';
import { IPost } from '@/shared/types';

interface TweetCardProps {
    post: IPost;
}

// region CARD COMPONENT
export default function TweetCard({post}: TweetCardProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [likes, setLikes] = useState(post.likes_count);
    const [dislikes, setDislikes] = useState(post.dislikes_count);
    const [comments, setComments] = useState<any[]>([]);

    const router = useRouter(); // ✅ Initialize router

    // Use the deletePost mutation from RTK Query
    const [deletePost] = useDeletePostMutation();
    const [likePost] = useToggleLikeMutation();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    useEffect(() => {
        setLikes(post.likes_count);
        setDislikes(post.dislikes_count);
        setComments([]); // Initialize comments as an empty array
    }, [post]);

    const handleEdit = () => {
        setIsEditOpen(true);
        handleClose();
    };

    const handleTitleClick = () => {
        console.log("Title clicked!");
        router.push(`/post/${post._id}`);
    };

    const handleDelete = async () => {
        try {
            await deletePost(post._id).unwrap();

        } catch (err) {
            console.error("Error deleting post:", err);
        }
        handleClose();
    };

    const handleLike = async () => {
        try {
            const isAlreadyLiked = likes > post.likes_count;
            setLikes((prev) => (isAlreadyLiked ? prev - 1 : prev + 1));

            await likePost({postId: post._id}).unwrap();

            if (!isAlreadyLiked) {
                console.log("📢 Emitting like notification...", {
                    recipientId: post.owner._id,
                    senderId: "CURRENT_USER_ID",  // Replace with actual logged-in user ID
                    postId: post._id,
                    type: "like",
                    message: `Someone liked your post.`,
                });

                // THIS HAVE TO SEND REQUEST FOR EMIT NOTIFICATION
                // TESTING IS REQUIRED
                // socket.emit("notification", {
                //   recipientId: post.owner._id,
                //   senderId: "CURRENT_USER_ID",
                //   postId: post._id,
                //   type: "like",
                //   message: `Someone liked your post.`,
                // });
            }

        } catch (err) {
            console.error("Error liking post:", err);
            setLikes(post.likes_count);
        }
    };

    // Create a new post object for editing
    const editPost = {
        ...post,
        content: post.content,
    };

    // region Main UI
    return (
        <Card
            sx={{
                width: "100%", // Full width for all screens
                maxWidth: 650, // Prevents card from being too wide
                minWidth: 600, // Ensures the card doesn't shrink too much
                margin: "auto",
                my: 2,
                boxShadow: 3,
                borderRadius: 2,
                padding: "8px", // Adjust padding for smaller screens
                overflow: "hidden", // Prevents scroll issues
            }}
        >
            {/* HEADER */}
            <CardHeader
                avatar={
                    <Avatar
                        src={post?.owner?.profilePhoto || ''}
                        sx={{bgcolor: red[500]}}
                    >
                        {post?.owner?.firstname[0] || ''}
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings" onClick={handleClick}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={`${post?.owner?.firstname} ${post?.owner?.lastname} || ${post?.owner?.title}`}
                subheader={new Date(post?.createdAt).toDateString()}
            />

            {/* Options Menu */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>

            {/* MEDIA */}
            {(post.image && post.image.trim() !== '') ? (
                <CardMedia
                    component="img"
                    sx={{
                        height: "auto",
                        maxHeight: 220, // Adjust height within the range
                        objectFit: "cover",
                        width: "100%", // Prevents overflow issues
                        maxWidth: "100%",
                    }}
                    image={post.image}
                    alt={post?.owner?.title || "Default Image"}
                />
            ) : null}

            {/* CONTENT */}
            <CardContent>
                <Typography variant={"h6"} color="text.primary" onClick={handleTitleClick}>
                    {post?.owner?.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {post.content}
                </Typography>
            </CardContent>

            {/* ACTIONS */}
            <CardActions>
                <IconButton onClick={handleLike}><FavoriteIcon
                    color={likes > post.likes_count ? "primary" : "inherit"}/></IconButton>
                <Typography>{likes} Likes</Typography>
            </CardActions>

            {/* COMMENT SECTION */}
            <CommentSection postId={post._id} initialComments={comments}/>

            {/* EDIT POST DIALOG */}
            {isEditOpen && (
                <EditPostDialog
                    open={isEditOpen}
                    setOpen={setIsEditOpen}
                    post={editPost}
                    onPostUpdated={() => console.log("Post updated! Refresh UI here")}
                />
            )}
        </Card>
    )
}
