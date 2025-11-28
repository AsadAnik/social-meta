import React, { useState } from "react";
import { Avatar, Card, InputBase } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PostFormModal from "@/components/common/TweetModal/PostFormModal"; // Corrected import path
import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store"; // Import RootState for selector typing

interface CreateInputProps {
    onPostCreated: () => void;
}

// region INPUT COMPONENT
const CreateInput: React.FC<CreateInputProps> = ({ onPostCreated }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    // Correctly select the user object from the Redux state
    const { data: currentUser } = useSelector((state: RootState) => state.user);

    const handlePaperClick = () => setOpen(true);

    // region Main UI
    return (
        <>
            <Card
                component="form"
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    width: "fit-content",
                    maxWidth: 650,
                    minWidth: 600,
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
                    src={currentUser?.profilePhoto || ''} // Use user data from selector
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
                    placeholder={`What's on your mind, ${currentUser?.firstname || ''}?`}
                    inputProps={{ "aria-label": "What's on your mind?" }}
                    onClick={handlePaperClick}
                    readOnly
                />
            </Card>

            {/* ==== CREATE POST DIALOG CONTENT ==== */}
            {/* Pass the user object to the modal */}
            {open && currentUser && (
                <PostFormModal
                    mode="create"
                    open={open}
                    setOpen={setOpen}
                    onPostUpdated={onPostCreated}
                    currentUser={currentUser}
                />
            )}
        </>
    );
};

export default CreateInput;
