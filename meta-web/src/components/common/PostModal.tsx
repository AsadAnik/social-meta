"use client";

import { useState } from "react";
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
import { useCreatePostMutation, useFetchPostsQuery } from "@/redux/slice/post.slice";
import { useDispatch, useSelector } from "react-redux";
import toaster from "react-hot-toast";
import { AppDispatch } from "@/redux/store";


interface CreatePostDialogProps {
  avatarSrc: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  onPostCreated: () => void;
}

// region CREATE POST DIALOG
export default function CreatePostDialog({ avatarSrc, open, setOpen, onPostCreated }: CreatePostDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [body, setBody] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { refetch } = useFetchPostsQuery({ page: 1, limit: 5 });
  const data = useSelector((state: {
    posts(arg0: string, posts: any): unknown; postsApi: any
  }) => state);

  console.log('data from post model', data.posts);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async () => {
    if (!body.trim()) return;

    const postData = new FormData();
    postData.append("content", body);
    if (image) postData.append("file", image);

    try {
      await createPost(postData).unwrap();
      onPostCreated();
      toaster.success("Post created successfully!");

      setOpen(false);
      await refetch();
    } catch (error) {
      toaster.error("Failed to create post.");
    }
  };

  // region Main UI
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* ---- TITLE DIALOG ---- */}
      <DialogTitle
        sx={{
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
          Create Post
        </Typography>

        <IconButton onClick={() => setOpen(false)} sx={{ color: "rgba(0,0,0,0.7)" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* ---- CONTENT DIALOG ---- */}
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Avatar src={avatarSrc} sx={{ width: 50, height: 50 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Yaseen Arafat
            </Typography>
          </Box>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="What's on your mind?"
          variant="standard"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: "1.25rem", p: 1, borderRadius: 1 },
          }}
        />

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
          <Typography>Add to your post</Typography>
          <Stack direction="row" spacing={1}>
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              id="image-upload"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload">
              <IconButton component="span" sx={{ color: "#4CAF50" }}>
                <PhotoLibrary />
              </IconButton>
            </label>
          </Stack>
        </Box>

        <Button
          fullWidth
          loading={isLoading}
          loadingPosition="start"
          variant="contained"
          onClick={handleSubmit}
          disabled={!body.trim() && !image}
          sx={{
            mt: 2,
            textTransform: "none",
            bgcolor: "#1877F2",
            color: "white",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#145db2" },
          }}
        >
          Post
        </Button>
      </DialogContent>
    </Dialog>
  );
}
