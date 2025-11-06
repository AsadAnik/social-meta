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
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useRouter } from 'next/navigation';
import EditPostDialog from './EditModel';
import { useDeletePostMutation, useToggleLikeMutation } from '@/redux/slice/post.slice';
import CommentModal from '../CommentModal';
import { IPost } from '@/shared/types';

interface TweetCardProps {
    post: IPost;
}

type likeType = {
    liked: boolean;
    likes_count: number;
};

// region CARD COMPONENT
const TweetCard = ({ post }: TweetCardProps) => {
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [likeObj, setLikeObj] = useState<likeType>({
        liked: post.likedByCurrentUser || false,
        likes_count: post.likes_count || 0,
    });

    const router = useRouter(); // ✅ Initialize router

    // Use the deletePost mutation from RTK Query
    const [deletePost] = useDeletePostMutation();
    const [likePost, { isLoading: isLiking }] = useToggleLikeMutation();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    // Sync local state with prop changes to ensure UI is always up-to-date
    useEffect(() => {
        setLikeObj({
            liked: post.likedByCurrentUser || false,
            likes_count: post.likes_count || 0,
        });
    }, [post.likedByCurrentUser, post.likes_count]);

    // region Edit Post
    const handleEdit = () => {
        setIsEditOpen(true);
        handleClose();
    };

    // region Click Title
    const handleTitleClick = () => {
        console.log("Title clicked!");
        router.push(`/post/${post._id}`);
    };

    // region Delete Like
    const handleDelete = async () => {
        try {
            await deletePost(post._id).unwrap();

        } catch (err) {
            console.error("Error deleting post:", err);
        }
        handleClose();
    };

    /**
     * HANDLE LIKE
     * This will handle to generate likes
     */
    // region Handle Like
    const handleLike = async () => {
        if (isLiking) return; // Prevent multiple clicks while loading

        const originalState = { ...likeObj }; // Store original state for potential revert

        // Optimistic UI update
        setLikeObj((prevState: likeType) => ({
            liked: !prevState.liked,
            likes_count: prevState.liked ? prevState.likes_count - 1 : prevState.likes_count + 1,
        }));

        try {
            await likePost({ postId: post._id }).unwrap();
            // On success, RTK Query will refetch and the useEffect will sync the state.
        } catch (err) {
            console.error("Error liking post:", err);
            // On error, revert to the original state.
            setLikeObj(originalState);
        }
    };

    // Create a new post object for editing
    const { comments, ...editPost } = post;

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
                        sx={{ bgcolor: red[500] }}
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
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
                {/* LIKE BUTTON & COUNTS TEXT */}
                <IconButton
                    onClick={handleLike}
                    disabled={isLiking}
                    color={likeObj.liked ? 'primary' : 'default'}
                >
                    <FavoriteIcon/>
                </IconButton>
                <Typography>{likeObj.likes_count} Likes</Typography>

                {/* COMMENT BUTTON & COUNTS TEXT */}
                <IconButton onClick={() => setIsCommentModalOpen(true)}>
                    <ChatBubbleOutlineIcon/>
                </IconButton>
                <Typography>{post.comments_count} Comments</Typography>
            </CardActions>

            {/* COMMENT MODAL */}
            {isCommentModalOpen && (
                <CommentModal
                    postId={post._id}
                    open={isCommentModalOpen}
                    onClose={() => setIsCommentModalOpen(false)}
                />
            )}

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

export default TweetCard;
