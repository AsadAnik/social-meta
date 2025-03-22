"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  IconButton,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import { Close, PhotoLibrary } from "@mui/icons-material";
import { useUpdatePostMutation, useFetchPostsQuery } from "@/redux/slice/post.slice";
import toaster from "react-hot-toast";


interface Post {
  _id: string;
  content: string;
  createdAt: string;
  likes_count: number;
  comments_count: number;
  image?: string; // Include post image field
  owner: {
    firstname: string;
    lastname: string;
    profilePhoto?: string;
    title: string;
  };
}

interface EditPostDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  post: Post;
  onPostUpdated?: () => void;
}

export default function EditPostDialog({ open, setOpen, post, onPostUpdated }: EditPostDialogProps) {
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.image || null);
  const { refetch } = useFetchPostsQuery({ page: 1, limit: 5 });

  const [updatePost, { isLoading }] = useUpdatePostMutation();

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Pre-fill state when modal opens
  useEffect(() => {
    if (open) {
      setContent(post.content);
      setImagePreview(post.image || null); // Use actual post image
      setImage(null);
    }
  }, [open, post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!content.trim()) {
      toaster.error("Content cannot be empty.");
      return;
    }

    const postData = new FormData();
    postData.append('content', content);

    if (image) {
      postData.append('image', image);
    }

    try {
      const updatedPost = await updatePost({ id: post._id, postData }).unwrap();
      refetch();
      console.log("Updated post:", updatedPost);

      toaster.success("Post updated successfully!");

      // Call the update function to refresh UI state
      onPostUpdated?.();

      setOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toaster.error("Failed to update post. Try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
          Edit Post
        </Typography>
        <IconButton onClick={() => setOpen(false)} sx={{ color: "rgba(0,0,0,0.7)" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Avatar
            src={post.owner.profilePhoto || "https://via.placeholder.com/150"}
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {post.owner.firstname} {post.owner.lastname}
            </Typography>
            <Typography variant="body2" sx={{ color: "gray" }}>
              {formatDate(post.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Content Input */}
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Edit your post..."
          variant="standard"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: "1.25rem", p: 1, borderRadius: 1 },
          }}
        />

        {/* Image Preview */}
        {imagePreview && (
          <Box
            sx={{
              mt: 2,
              p: 1,
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 2,
              textAlign: "center",
              position: "relative",
            }}
          >
            <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", borderRadius: 5 }} />
            <IconButton
              sx={{ position: "absolute", top: 5, right: 5, bgcolor: "rgba(0,0,0,0.6)", color: "white" }}
              onClick={() => {
                setImage(null);
                setImagePreview(null);
              }}
            >
              <Close />
            </IconButton>
          </Box>
        )}

        {/* Image Upload */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>Change image</Typography>
          <Stack direction="row" spacing={1}>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              id="image-upload-edit"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload-edit">
              <IconButton component="span" sx={{ color: "#4CAF50" }}>
                <PhotoLibrary />
              </IconButton>
            </label>
          </Stack>
        </Box>

        {/* Update Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleUpdate}
          disabled={!content.trim() || isLoading}
          sx={{
            mt: 2,
            textTransform: "none",
            bgcolor: "#1877F2",
            color: "white",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#145db2" },
          }}
        >
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
}
