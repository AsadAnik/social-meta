import * as React from "react";
import { useState } from "react";
import { Paper, InputBase, IconButton, Avatar, Box, Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CreatePostDialog from "./PostModal";

interface CreateInputProps {
  userProfileImage: string;
  onPostCreated: () => void;
}

const CreateInput: React.FC<CreateInputProps> = ({ userProfileImage, onPostCreated }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handlePaperClick = () => setOpen(true);

  return (
    <>
      <Card
        component="form"
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          borderRadius: "16px",
          boxShadow: theme.palette.mode === "dark" ? "0px 4px 12px rgba(255, 255, 255, 0.1)" : "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: theme.palette.background.paper,
          transition: "0.3s",
          "&:hover": {
            boxShadow: theme.palette.mode === "dark" ? "0px 6px 16px rgba(255, 255, 255, 0.2)" : "0px 6px 16px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Avatar
          alt="User Profile"
          src={userProfileImage}
          sx={{ width: 48, height: 48, mr: 2 }}
        />
        <InputBase
          sx={{
            flex: 1,
            borderRadius: "8px",
            backgroundColor: theme.palette.mode === "dark"
              ? theme.palette.grey[900] // Dark mode background
              : theme.palette.grey[100], // Light mode background
            p: "10px 14px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[200],
            },
          }}
          placeholder="What's on your mind?"
          inputProps={{ "aria-label": "What's on your mind?" }}
          onClick={handlePaperClick}
          readOnly
        />
      </Card>

      <CreatePostDialog 
        avatarSrc={userProfileImage} 
        open={open} 
        setOpen={setOpen} 
        onPostCreated={onPostCreated} 
      />
    </>
  );
};

export default CreateInput;
