"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack,
} from "@mui/material"
import { Close, PhotoLibrary, PersonAdd, EmojiEmotions, LocationOn, GifBox, MoreHoriz } from "@mui/icons-material"

interface CreatePostDialogProps {
    avatarSrc: string;
    open: boolean;
    setOpen: (value: boolean) => void;
  }

export default function CreatePostDialog({ avatarSrc, open, setOpen }: CreatePostDialogProps) {
  const [privacy, setPrivacy] = useState("friends")

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#f0f2f5",
          color: "black",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
          Create Post
        </Typography>
        <IconButton onClick={() => setOpen(false)} sx={{ color: "rgba(0,0,0,0.7)" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Avatar
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-03%20at%208.31.41%E2%80%AFPM-Eds4AyVFZMczfhR8jlANXo1lxilPxO.png"
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Yaseen Arafat
            </Typography>
            <Select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              size="small"
              sx={{
                color: "black",
                bgcolor: "rgba(0,0,0,0.05)",
                borderRadius: 1,
                fontSize: "0.875rem",
                height: 32,
              }}
            >
              <MenuItem value="friends">Friends</MenuItem>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </Box>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="What's on your mind, Yaseen?"
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: "black",
              fontSize: "1.25rem",
              bgcolor: "white",
              p: 1,
              borderRadius: 1,
              "&::placeholder": {
                color: "rgba(0,0,0,0.5)",
              },
            },
          }}
        />

        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#ffffff",
          }}
        >
          <Typography>Add to your post</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ color: "#4CAF50" }}>
              <PhotoLibrary />
            </IconButton>
            <IconButton sx={{ color: "#2196F3" }}>
              <PersonAdd />
            </IconButton>
            <IconButton sx={{ color: "#FFC107" }}>
              <EmojiEmotions />
            </IconButton>
            <IconButton sx={{ color: "#F44336" }}>
              <LocationOn />
            </IconButton>
            <IconButton sx={{ color: "#00BCD4" }}>
              <GifBox />
            </IconButton>
            <IconButton>
              <MoreHoriz />
            </IconButton>
          </Stack>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            textTransform: "none",
            bgcolor: "#1877F2",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#145db2",
            },
          }}
        >
          Post
        </Button>
      </DialogContent>
    </Dialog>
  )
}
