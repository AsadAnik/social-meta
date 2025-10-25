import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, List, ListItem, ListItemText, TextField, Typography, } from '@mui/material';
import { useAddCommentMutation } from '@/redux/slice/comment.slice';
import CommentModal from './CommentModal';
import { IComment } from '@/shared/types';

interface CommentSectionProps {
    postId: string;
    commentsCount: number;
}

// region COMMENT SECTION
const CommentSection: React.FC<CommentSectionProps> = ({ postId, commentsCount }) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Create a new state for the total count
    const [currentTotalComments, setCurrentTotalComments] = useState<number>(commentsCount);
    const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

    /**
     * Handles the addition of a new comment to a post.
     * @async
     * @function handleAddComment
     * @returns {Promise<void>} Resolves when the comment is successfully added or handles
     * the error if the addition fails.
     */
    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                const response = await addComment({
                    postId,
                    comment: newComment,
                }).unwrap();

                if (response && response.comment) {
                    // Update both the comments list and the total count
                    setComments((prev) => [...prev, response.comment]);
                    setCurrentTotalComments((prev) => prev + 1);
                }
                setNewComment('');
            } catch (err) {
                console.error('Error adding comment:', err);
            }
        }
    };

    const visibleComments: IComment[] = comments.length ? comments.slice(0, 2) : [];

    // region Main UI
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
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

            {/* Use the new state variable for the condition */}
            {currentTotalComments > 2 && (
                <Button onClick={() => setIsModalOpen(true)}>
                    View all {currentTotalComments} comments
                </Button>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    label="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={isAddingComment}
                    loading={isAddingComment}
                    // loadingPosition="start"
                >
                    Comment
                </Button>
            </Box>

            <CommentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} postId={postId}/>
        </Box>
    );
};

export default CommentSection;
