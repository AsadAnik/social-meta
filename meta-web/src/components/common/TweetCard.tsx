"use client"
import React, { useState } from 'react';
import {
    Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography, Menu, MenuItem,
    Box
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditPostDialog from './EditModel';
import { useMediaQuery } from '@mui/material';
import { useDeletePostMutation } from '@/redux/slice/post.slice';

interface TweetCardProps {
    post: {
        content: string;
        _id: string;
        createdAt: string;
        likes_count: number;
        comments_count: number;
        owner: {
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

    // Use the deletePost mutation from RTK Query
    const [deletePost] = useDeletePostMutation();

    // Detect screen size
    const isMobile = useMediaQuery("(max-width: 600px)");

    const handleExpandClick = () => setExpanded(!expanded);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleEdit = () => {
        setIsEditOpen(true);
        handleClose();
    };

    const handleDelete = async () => {
        try {
            const data = await deletePost(post._id).unwrap();

        } catch (err) {
            console.error("Error deleting post:", err);
        }
        handleClose();
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
                <Typography variant={isMobile ? "h6" : "h5"} color="text.primary">
                    {post?.owner?.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.content}
                </Typography>
            </CardContent>

            {/* ACTIONS */}
            <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <Typography>{post.likes_count} Likes</Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    <Typography>{post?.comments_count} Comments</Typography>
                </Box>

                <IconButton
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
            </CardActions>

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
    );
}