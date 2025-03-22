"use client"
import React, { useEffect, useState } from 'react';
import {
    Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, Menu, MenuItem,
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
    Button
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useRouter } from 'next/navigation';
import EditPostDialog from './EditModel';
import { useMediaQuery } from '@mui/material';
import { useDeletePostMutation, useToggleLikeMutation } from '@/redux/slice/post.slice';
import { useAddCommentMutation } from '@/redux/slice/comment.slice';
import CommentSection from '../CommentSection';
import { socket } from '@/lib/socket';

interface TweetCardProps {
    post: {
        content: string;
        _id: string;
        createdAt: string;
        likes_count: number;
        comments_count: number;
        dislikes_count: number;
        owner: {
            _id: any;
            firstname: string;
            lastname: string;
            profilePhoto?: string;
            title: string;
        };
    };
}

export default function TweetCard({ post }: TweetCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [likes, setLikes] = useState(post.likes_count);
    const [dislikes, setDislikes] = useState(post.dislikes_count);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");

    const router = useRouter(); // ✅ Initialize router


    // Use the deletePost mutation from RTK Query
    const [deletePost] = useDeletePostMutation();
    const [likePost] = useToggleLikeMutation();
    // const [dislikePost] = useDislikePostMutation();
    const [addComment] = useAddCommentMutation();

    // Detect screen size
    const isMobile = useMediaQuery("(max-width: 600px)");

    const handleExpandClick = () => setExpanded(!expanded);
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

            await likePost({ postId: post._id }).unwrap();

            if (!isAlreadyLiked) {
                socket.emit("sendNotification", {
                    recipientId: post.owner._id,
                    senderId: post.owner._id, // Use post.owner._id instead of user._id
                    postId: post._id,
                    type: "like",
                    message: `Someone liked your post.`, // Remove reference to user.firstname
                });
            }
        } catch (err) {
            console.error("Error liking post:", err);
            setLikes(post.likes_count);
        }
    };

    const handleDislike = async () => {
        try {
            // await dislikePost(post._id).unwrap();
            setDislikes((prev) => prev + 1);
        } catch (err) {
            console.error("Error disliking post:", err);
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const response = await addComment({ postId: post._id, comment: newComment }).unwrap();
                setComments((prev) => [...prev, response]); // Add the new comment to the list
                setNewComment(""); // Clear the input field
            } catch (err) {
                console.error("Error adding comment:", err);
            }
        }
    };

    // Create a new post object for editing
    const editPost = {
        ...post,
        content: post.content,
    };

    return (
        <Card
            sx={{
                width: "100%", // Full width for all screens
                maxWidth: 499, // Prevents card from being too wide
                minWidth: 320, // Ensures the card doesn't shrink too much
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
                        <MoreVertIcon />
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
            <CardMedia
                component="img"
                sx={{
                    height: "auto",
                    maxHeight: 220, // Adjust height within the range
                    objectFit: "cover",
                    width: "100%", // Prevents overflow issues
                    maxWidth: "100%",
                }}
                image={
                    post.owner?.profilePhoto === "avatar" || !post.owner?.profilePhoto?.trim()
                        ? "https://www.stuff.tv/wp-content/uploads/sites/2/2024/09/meta-ai.jpg?w=1080"
                        : post.owner.profilePhoto
                }
                alt={post?.owner?.title || "Default Image"}
            />


            {/* CONTENT */}
            <CardContent>
                <Typography variant={isMobile ? "h6" : "h5"} color="text.primary" onClick={handleTitleClick}>
                    {post?.owner?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.content}
                </Typography>
            </CardContent>

            {/* ACTIONS */}
            <CardActions>
                <IconButton onClick={handleLike}><FavoriteIcon color={likes > post.likes_count ? "primary" : "inherit"} /></IconButton>
                <Typography>{likes} Likes</Typography>
                <IconButton onClick={handleExpandClick}><ExpandMoreIcon /></IconButton>
            </CardActions>
            {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Comments</Typography>
                    <List>
                        {Array.isArray(comments) && comments.map((comment, index) => (
                            <React.Fragment key={index}>
                                <ListItem>
                                    <ListItemText primary={comment.text} secondary={comment.user} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <TextField fullWidth label="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                        <Button variant="contained" onClick={handleAddComment}>Post</Button>
                    </Box>
                </CardContent>
            </Collapse> */}
            <CommentSection postId={post._id} initialComments={comments} />


            {/* COLLAPSIBLE SECTION */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ maxHeight: "200px", overflowY: "auto" }}>
                    <Typography paragraph>Post created on: {new Date(post?.createdAt).toLocaleDateString()}</Typography>
                    <Typography paragraph>
                        This is an additional expandable section. You can modify this text to display more details.
                    </Typography>
                </CardContent>
            </Collapse>


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