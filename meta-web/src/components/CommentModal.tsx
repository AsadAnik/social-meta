import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAddCommentMutation, useLazyFetchCommentsQuery } from '@/redux/slice/comment.slice';
import { IComment } from '@/shared/types';

interface CommentModalProps {
    open: boolean;
    onClose: () => void;
    postId: string;
}

// region COMMENT MODAL
const CommentModal: React.FC<CommentModalProps> = ({ open, onClose, postId }) => {
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);
    const [comments, setComments] = useState<IComment[]>([]);
    const [fetchComments, { data: responseData, isLoading, isFetching, error }] = useLazyFetchCommentsQuery();
    const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
    const hasMore = responseData?.hasNextPage ?? false;

    // region EFFECTS
    useEffect(() => {
        if (open) {
            setComments([]); // Clear comments when modal opens
            setPage(1);      // Reset page to 1
            fetchComments({ postId, page: 1, limit: 5 });
        }
    }, [open, postId, fetchComments]);

    useEffect(() => {
        if (page > 1) {
            fetchComments({ postId, page, limit: 5 });
        }
    }, [page]);

    useEffect(() => {
        if (responseData?.comments) {
            setComments((prev) => {
                const mixUpdatesAndOld = [...prev, ...responseData.comments];
                const uniqueData = new Set(mixUpdatesAndOld);
                return Array.from(uniqueData);
            });
        }
    }, [responseData]);

    // region Load More
    const handleLoadMore = () => {
        if (!isFetching && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    // region Add Comment
    const handleAddComment = async () => {
        if (newComment.trim()) {
            try {
                await addComment({ postId, comment: newComment }).unwrap();
                setNewComment('');
                // After adding a comment, refetch the first page to see the new comment
                setComments([]);
                setPage(1);
                fetchComments({ postId, page: 1, limit: 5 });
            } catch (err) {
                console.error('Error adding comment:', err);
            }
        }
    };

    const handleClose = () => {
        setComments([]);
        setPage(1);
        onClose();
    };

    // region Main UI
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Comments
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ height: '400px' }}>
                {isLoading && <CircularProgress/>}
                {error && <Typography color="error">Failed to load comments.</Typography>}
                {comments.length > 0 && (
                    <List>
                        {comments.map((comment: IComment) => (
                            <React.Fragment key={comment._id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar src={comment.user?.profilePhoto}>
                                            {comment.user?.firstname?.[0]}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${comment.user?.firstname} ${comment.user?.lastname}`}
                                        secondary={comment.comment}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li"/>
                            </React.Fragment>
                        ))}
                    </List>
                )}
                {hasMore && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button onClick={handleLoadMore} disabled={isFetching}>
                            {isFetching ? <CircularProgress size={24}/> : 'Load More'}
                        </Button>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: '1rem' }}>
                <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleAddComment} disabled={isAddingComment}>
                        {isAddingComment && <CircularProgress size={24} sx={{ color: 'white', marginRight: 1 }}/>}
                        Comment
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CommentModal;
