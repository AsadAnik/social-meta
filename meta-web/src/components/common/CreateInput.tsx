import * as React from "react";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CreatePostDialog from "./PostModal";
import { useTheme } from "@mui/material/styles";


interface CustomizedInputProps {
  userProfileImage: string;
}

const CreateInput: React.FC<CustomizedInputProps> = ({ userProfileImage }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme()

  const handlePaperClick = () => setOpen(true);

  return (
    <>
      <Paper
        component="form"
        sx={{
          p: "10px 16px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
          position: "relative",
          left: "20px",
          zIndex: 1000,
        }}
      >
        <Avatar
          alt="User Profile"
          src={userProfileImage}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            borderRadius: "8px",
            backgroundColor: theme.palette.mode === "dark"
              ? theme.palette.grey[900] // Dark mode background
              : theme.palette.grey[100], // Light mode background
            p: "8px 12px",
          }}
          placeholder="What's on your mind?"
          inputProps={{ "aria-label": "What's on your mind?" }}
          onClick={handlePaperClick}
          readOnly
        />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="send"
        ></IconButton>
      </Paper>
      <CreatePostDialog avatarSrc={userProfileImage} open={open} setOpen={setOpen} />
    </>
  );
};
export default CreateInput;

// <CustomizedInputBase userProfileImage="https://via.placeholder.com/150" />
