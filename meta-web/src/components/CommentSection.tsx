import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, List, ListItem, ListItemText, Typography, } from '@mui/material';
import { useFetchCommentsQuery } from '@/redux/slice/comment.slice';
import CommentModal from './CommentModal';
import { IComment } from '@/shared/types';

interface CommentSectionProps {
    postId: string;
}

// region COMMENT SECTION
const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTotalComments, setCurrentTotalComments] = useState<number>(0);
    const { data, isLoading, error } = useFetchCommentsQuery({ postId, page: 1, limit: 5 });

    useEffect(() => {
        if (!isLoading && !error && data && Array.isArray(data.comments)) {
            setCurrentTotalComments(data.comments.length);
            setComments(data.comments);
        }
    }, [data, isLoading, error]);

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

            {currentTotalComments > 2 && (
                <Button onClick={() => setIsModalOpen(true)}>
                    View all {currentTotalComments} comments
                </Button>
            )}

            <CommentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} postId={postId}/>
        </Box>
    );
};

export default CommentSection;
