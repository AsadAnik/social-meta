import React, { useState } from 'react';
import { Box, Button, Divider, List, ListItem, ListItemText, TextField, Typography, } from '@mui/material';
import { useAddCommentMutation } from '@/redux/slice/comment.slice';
import CommentModal from './CommentModal'; // Import the new modal

interface CommentSectionProps {
    postId: string;
    initialComments: any[];
    totalComments: number;
}

// region COMMENT SECTION
const CommentSection: React.FC<CommentSectionProps> = ({postId, initialComments, totalComments}) => {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addComment] = useAddCommentMutation();

    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const response = await addComment({
                    postId,
                    comment: newComment,
                }).unwrap();

                if (response && response.comment) {
                    setComments((prev) => [...prev, response.comment]);
                }
                setNewComment('');
            } catch (err) {
                console.error('Error adding comment:', err);
            }
        }
    };

    const visibleComments = comments.slice(0, 2);

    // region Main UI
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, mt: 2}}>
            <Typography variant="h6">Comments</Typography>
            <List disablePadding>
                {visibleComments.map((comment, index) => (
                    <React.Fragment key={comment._id || `comment-${index}`}>
                        <ListItem>
                            <ListItemText
                                primary={comment.comment}
                                secondary={comment.user?.name || 'Anonymous'}
                            />
                        </ListItem>
                        <Divider/>
                    </React.Fragment>
                ))}
            </List>

            {totalComments > 2 && (
                <Button onClick={() => setIsModalOpen(true)}>
                    View all {totalComments} comments
                </Button>
            )}

            <Box sx={{display: 'flex', gap: 1}}>
                <TextField
                    fullWidth
                    label="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddComment}>
                    Comment
                </Button>
            </Box>

            {/* ==== All Comments to Show into Modal ==== */}
            <CommentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} postId={postId}/>
        </Box>
    );
};

export default CommentSection;
