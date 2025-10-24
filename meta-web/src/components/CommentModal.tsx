import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFetchCommentsQuery } from '@/redux/slice/comment.slice';

interface CommentModalProps {
  open: boolean;
  onClose: () => void;
  postId: string;
}

const CommentModal: React.FC<CommentModalProps> = ({ open, onClose, postId }) => {
  const { data: comments, isLoading, isError } = useFetchCommentsQuery(postId, {
    skip: !open, // Only fetch when the modal is open
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Comments
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading && <CircularProgress />}
        {isError && <Typography color="error">Failed to load comments.</Typography>}
        {comments && (
          <List>
            {comments.map((comment: any, index: number) => (
              <React.Fragment key={comment._id || `comment-${index}`}>
                <ListItem>
                  <ListItemText
                    primary={comment.comment}
                    secondary={comment.user?.name || 'Anonymous'}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
