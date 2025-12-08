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
import { useCreatePostMutation, useUpdatePostMutation } from "@/redux/slice/post.slice";
import toaster from "react-hot-toast";
import { IUser, IPost } from '@/shared/types';
import { TextUtils } from '@/shared/utils';

interface PostFormModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    onPostUpdated?: () => void;
    mode: 'create' | 'edit';
    post?: IPost; // Required for 'edit' mode
    currentUser?: IUser | null; // User for 'create' mode
}

// region POST FORM MODAL
const PostFormModal = ({ open, setOpen, onPostUpdated, mode, post, currentUser }: PostFormModalProps) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

    const isEditMode = mode === 'edit';
    const isLoading = isCreating || isUpdating;

    // region EFFECTS
    // Pre-fill state when modal opens for editing
    useEffect(() => {
        if (open) {
            if (isEditMode && post) {
                setContent(post.content);
                setImagePreview(post.image || null);
            } else {
                setContent("");
                setImagePreview(null);
            }
            setImage(null);
        }
    }, [open, post, isEditMode]);

    // Clean up the image preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // region Image Change Handle
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // region Submit Handle
    const handleSubmit = async () => {
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
            if (isEditMode && post) {
                await updatePost({ postId: post._id, postData }).unwrap();
                toaster.success("Post updated successfully!");

            } else {
                await createPost(postData).unwrap();
                toaster.success("Post created successfully!");
            }

            onPostUpdated?.();
            setOpen(false);

        } catch (error) {
            console.error("Error:", error);
            toaster.error(`Failed to ${mode} post. Try again.`);
        }
    };

    // Determine which user's info to display based on the mode.
    const userToDisplay = isEditMode ? post?.owner : currentUser;
    const dialogTitle = isEditMode ? "Edit Post" : "Create Post";
    const buttonText = isEditMode ? "Update" : "Post";

    // Don't render the modal if the necessary user info isn't available yet.
    if (!userToDisplay) {
        return null;
    }

    // region Main UI
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
                    {dialogTitle}
                </Typography>
                <IconButton onClick={() => setOpen(false)} sx={{ color: "rgba(0,0,0,0.7)" }}>
                    <Close/>
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {/* ==== MODAL HEADING ==== */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, mt: 2 }}>
                    <Avatar
                        src={userToDisplay.profilePhoto || "https://via.placeholder.com/150"}
                        sx={{ width: 50, height: 50 }}
                    />
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                            <span>{TextUtils.capitalizedTextFormat(userToDisplay.firstname)}</span>
                            <span>{" "}</span>
                            <span>{TextUtils.capitalizedTextFormat(userToDisplay.lastname)}</span>
                        </Typography>

                        <Typography variant="body2" sx={{ color: "gray" }}>
                            {TextUtils.capitalizedTextFormat(userToDisplay.title)}
                        </Typography>
                    </Box>
                </Box>

                {/* ==== POST FIELD ==== */}
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder={isEditMode ? "Edit your post..." : "What's on your mind?"}
                    variant="standard"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: "1.25rem", p: 1, borderRadius: 1 },
                    }}
                />

                {/* ==== CLOSE MODAL ==== */}
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
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", borderRadius: 5 }}/>
                        <IconButton
                            sx={{ position: "absolute", top: 5, right: 5, bgcolor: "rgba(0,0,0,0.6)", color: "white" }}
                            onClick={() => {
                                setImage(null);
                                setImagePreview(null);
                            }}
                        >
                            <Close/>
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
                    <Typography>{isEditMode ? "Change image" : "Add to your post"}</Typography>
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
                                <PhotoLibrary/>
                            </IconButton>
                        </label>
                    </Stack>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
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
                    {buttonText}
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default PostFormModal;
