// import React from 'react';
// import { Typography, Avatar } from '@mui/material';
// import { MoreVert as MoreVertIcon } from '@mui/icons-material';
// import "../../css/postUI.css";
// import ViewComments from '../Comment/ViewComments';

// // PostUI Component..
// const PostUI = ({ body, image, user, comments }) => {

//     const renderUser = (USER) => {
//         if (!USER){
//             return (
//                 <div className="childBox header-box">
//                     {/* Profile Picture */}
//                     <div className="profileAvatar">
//                         <img src={`/profileUpload/20220330_010309.jpg`} alt="" />
//                     </div>
//                     {/* Firstname & Lastname */}
//                     <div className="profileText">
//                         <Typography variant="text" className="username-text">
//                             <span>Mohammad</span>
//                             <span>{" "}</span>
//                             <span>Asad</span>
//                         </Typography>

//                         <Typography variant="body2" className="title-text">
//                             <span>{"Software Developer"}</span>
//                         </Typography>
//                     </div>

//                     {/* Options Dot Menu */}
//                     <div className="optionsDotMenu">
//                         <MoreVertIcon />
//                     </div>
//                 </div>
//             );
//         }
//         if (USER){
//             return (
//                 <div className="childBox header-box">
//                     {/* Profile Picture */}
//                     <div className="profileAvatar">
//                         <Avatar
//                             src={`/profileUpload/${USER.profilePhoto}`}
//                             alt={USER.firstname}
//                         />
//                     </div>
//                     {/* Firstname & Lastname */}
//                     <div className="profileText">
//                         <Typography variant="text" className="username-text">
//                             <span>{USER.firstname}</span>
//                             <span>{" "}</span>
//                             <span>{USER.lastname}</span>
//                         </Typography>

//                         <Typography variant="body2" className="title-text">
//                             <span>{USER.title}</span>
//                         </Typography>
//                     </div>

//                     {/* Options Dot Menu */}
//                     <div className="optionsDotMenu">
//                         <MoreVertIcon />
//                     </div>
//                 </div>
//             );
//         }
//     };

//     const renderPostImage = (img) => {
//         if (!img){
//             return null;
//         }
//         if (img){
//             return (
//                 <div className="childBox">
//                     <img src={`/postUpload/${image}`} alt="Post Cover" style={{ maxWidth: 800 }} />
//                 </div>
//             );
//         }
//     };

//     return (
//         <div className="mainBox">
//             {/* ---- USER Info ---- */}
//             {renderUser(user)}

//             {/* ---- Post Image ---- */}
//             {renderPostImage(image)}

//             {/* ---- Post Body ---- */}
//             <div className="childBox">
//                 {/* <h3>{ body }</h3> */}
//                 <Typography variant="body1" dangerouslySetInnerHTML={{ __html: body }} />
//             </div>

//             {/* ----- Comments Section ---- */}
//             <div className="childBox">
//                 <ViewComments
//                     comments={comments}
//                 />
//             </div>
//         </div>
//     );
// };

// export default PostUI;

import React, { useState } from "react";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Divider,
    Box,
} from "@mui/material";
import {
    MoreHoriz,
    ThumbUp,
    ChatBubbleOutline,
    Share,
    BookmarkBorder,
    ThumbUpAlt,
} from "@mui/icons-material";
import "../../css/postUI.css"; // Import your custom CSS
import ViewComments from "../Comment/ViewComments"; // Import your comments component

export default function PostCard({ user, body, image, comments }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(56); // Example initial value; can be set dynamically
    const [anchorEl, setAnchorEl] = useState(null);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const renderUserInfo = (userInfo) => (
        <div className="header-box">
            <Avatar
                src={userInfo?.profilePhoto ? `/profileUpload/${userInfo.profilePhoto}` : "/profileUpload/20220330_010309.jpg"}
                alt={`${userInfo?.firstname || "Default"} ${userInfo?.lastname || "User"}`}
                className="profile-avatar"
            />
            <div className="profile-text">
                <Typography variant="h6" className="username-text">
                    {userInfo ? `${userInfo.firstname} ${userInfo.lastname}` : "Frances Guerrero"}
                </Typography>
                <Typography variant="body2" className="title-text">
                    {userInfo?.title || "Web Developer at Stackbros"} • 2 hours ago
                </Typography>
            </div>
            <IconButton className="options-menu" onClick={handleMenuClick}>
                <MoreHoriz />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleMenuClose}>Save post</MenuItem>
                <MenuItem onClick={handleMenuClose}>Hide post</MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
                    Report post
                </MenuItem>
            </Menu>
        </div>
    );

    const renderPostImage = (imgSrc) => (
        imgSrc && (
            <div className="post-image-box">
                <img src={`/postUpload/${imgSrc}`} alt="Post" className="post-image" />
                {console.log('checking image ',imgSrc)}
            </div>
        )
    );

    return (
        <Card className="post-card">
            <CardContent>
                {renderUserInfo(user)}
                <Typography variant="body1" className="post-body" dangerouslySetInnerHTML={{ __html: body }} />
                {renderPostImage(image)}
            </CardContent>

            <CardContent>
                <Box className="post-actions">
                    <Button
                        startIcon={liked ? <ThumbUpAlt sx={{ color: '#1976d2' }} /> : <ThumbUp />}
                        onClick={handleLike}
                        size="small"
                        className="like-button"
                    >
                        {likeCount}
                    </Button>
                    <Button startIcon={<ChatBubbleOutline />} size="small" className="comment-button">
                        {comments.length} Comments
                    </Button>
                    <Button startIcon={<Share />} size="small" className="share-button">
                        Share
                    </Button>
                    <IconButton>
                        <BookmarkBorder />
                    </IconButton>
                </Box>

                <div className="comment-section">
                    <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
                    <input
                        placeholder="Add a comment..."
                        className="comment-input"
                    />
                </div>

                {/* Render Comments Section */}
                <ViewComments comments={comments} />
            </CardContent>
        </Card>
    );
}
