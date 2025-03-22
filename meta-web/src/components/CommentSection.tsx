import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { useAddCommentMutation } from '@/redux/slice/comment.slice';
import useSocket from '@/hooks/useSocket';

interface CommentSectionProps {
  postId: string;
  initialComments: any[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [addComment] = useAddCommentMutation();


  const socket = useSocket("notification", (newNotificationData) => {
    if (newNotificationData.type === "comment" && newNotificationData.postId === postId) {
      // Push the entire comment object from the notification
      setComments((prevComments) => [...prevComments, newNotificationData.comment]);
    }
  });

  // If your socket is a shared global instance, you may not want to disconnect on unmount.
  useEffect(() => {
    return () => {
      // Uncomment if you have a dedicated socket instance per component
      // socket.disconnect();
    };
  }, [socket]);

  // Sync initial comments when they change
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        // Send the correct payload: { postId, comment }
        const response = await addComment({
          postId,
          comment: newComment, 
        }).unwrap();

        console.log("API Response:", response);
        // The API response is expected to be an object with a "comment" property
        if (response && response.comment) {
          // Add the complete comment object from the API response
          setComments((prev) => [...prev, response.comment]);
        } else {
          console.error("Error: No comment returned in the response");
        }
        setNewComment("");
      } catch (err) {
        console.error("Error adding comment:", err);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
      <Typography paragraph>Comments</Typography>
      <List>
        {Array.isArray(comments) &&
          comments.map((comment, index) => {
            if (!comment || typeof comment !== "object") {
              console.error("Invalid comment format:", comment);
              return null;
            }
            return (
              <React.Fragment key={comment._id || `comment-${index}`}>
                <ListItem>
                  <ListItemText
                    // Render the comment text. If it's not a string, stringify it.
                    primary={typeof comment.comment === 'string' ? comment.comment : JSON.stringify(comment.comment)}
                    // Render the user's name if available; otherwise "Anonymous"
                    secondary={comment?.user?.name ? comment.user.name : "Anonymous"}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
      </List>
      <Box sx={{ display: "flex", gap: 1 }}>
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
    </Box>
  );
};

export default CommentSection;
