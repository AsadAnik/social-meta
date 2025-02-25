import type React from "react";
import { useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    InputAdornment,
    TextField,
    Collapse,
    useTheme,
} from "@mui/material";
import { Person, Settings, Chat, Videocam, Palette, NotificationsNone, Search, ExpandMore } from "@mui/icons-material";

const menuItems = [
    { text: "Profile", icon: <Person sx={{ color: "action.active" }} /> },
    { text: "Account", icon: <Settings sx={{ color: "action.active" }} /> },
    { text: "Chat", icon: <Chat sx={{ color: "action.active" }} /> },
    { text: "Voice & video", icon: <Videocam sx={{ color: "action.active" }} /> },
    { text: "Appearance", icon: <Palette sx={{ color: "action.active" }} /> },
    { text: "Notification", icon: <NotificationsNone sx={{ color: "action.active" }} /> },
];

const SettingItem: React.FC = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [activeItem, setActiveItem] = useState("");
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: "100%", // Allow full width for smaller screens
                bgcolor: "background.paper",
                borderRight: "1px solid",
                borderColor: "divider",
                display: { xs: "block", md: "block" }, // Ensure block layout on all screens
                boxShadow: theme.shadows[3],
                height: "100%",
                overflow: "auto",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: theme.shadows[6],
                },
            }}
        >
            {/* Header with Search */}
            <Box sx={{ p: 3, position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: 700, color: "primary.main" }}>
                        Settings
                    </Typography>
                    <IconButton size="small" onClick={() => setSearchVisible(!searchVisible)}>
                        <Search />
                    </IconButton>
                </Box>

                {/* Search field */}
                <Collapse in={searchVisible}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search settings"
                        variant="outlined"
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    boxShadow: theme.shadows[2],
                                },
                                "&.Mui-focused": {
                                    boxShadow: theme.shadows[4],
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Collapse>
            </Box>

            {/* Menu Items */}
            <List sx={{ pt: 0 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => setActiveItem(item.text)}
                            sx={{
                                py: 2,
                                borderRadius: 2,
                                mx: 1,
                                mb: 1,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateX(5px)",
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 40,
                                    p: 1,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease",
                                    boxShadow: activeItem === item.text ? theme.shadows[4] : "none",
                                    mr: 1,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    sx: {
                                        fontWeight: activeItem === item.text ? 700 : 500,
                                        fontSize: "1rem",
                                        transition: "all 0.3s ease",
                                    },
                                }}
                            />
                            {activeItem === item.text && (
                                <ExpandMore
                                    sx={{
                                        transition: "all 0.3s ease",
                                        transform: "rotate(-90deg)",
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default SettingItem;
