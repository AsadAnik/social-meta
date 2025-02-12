"use client"

import React, { useState } from "react"
import { Box, Typography, Button, IconButton } from "@mui/material"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import styles from "@/styles/components/sidebar.module.scss"

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#0095F6" },
        text: { primary: "#F5F5F5", secondary: "#A8A8A8" },
        background: { default: "#000000", paper: "#000000" },
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
})
const currentUser = {
    username: "devilarmaan63",
    fullName: "Devil Armaan",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Real placeholder avatar
}

const suggestions = [
    {
        username: "chisty_mohiuddin",
        relationship: "Following asadanik",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
        username: "jishan.chowdhury.5895834",
        relationship: "Following asadanik",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
        username: "sarif.developer",
        relationship: "Followed by asadanik",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
        username: "meherfarnaj",
        relationship: "Followed by asadanik",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
        username: "rounaq1010",
        relationship: "Suggested for you",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
]


const footerLinks = [
    "About",
    "Help",
    "Press",
    "API",
    "Jobs",
    "Privacy",
    "Terms",
    "Locations",
    "Language",
    "Meta Verified",
]

export default function InstagramSuggestions() {
    const [showAllFooterLinks, setShowAllFooterLinks] = useState(false)

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ backgroundColor: "background.default", color: "text.primary", padding: "36px" }}>
                {/* User Profile Section */}
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <Box sx={{ position: "relative", width: 56, height: 56, marginRight: "12px" }}>
                        <Image src={currentUser.avatar || "/placeholder.svg"} alt="Profile" fill className={styles.avatar} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: "bold" }}>{currentUser.username}</Typography>
                        <Typography sx={{ color: "text.secondary" }}>{currentUser.fullName}</Typography>
                    </Box>
                    <Button color="primary" size="small" sx={{ marginLeft: "auto" }}>
                        Switch
                    </Button>
                </Box>

                {/* Suggestions Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <Typography sx={{ fontWeight: "bold" }}>Suggested for you</Typography>
                    <Typography sx={{ color: "primary.main", cursor: "pointer" }}>See All</Typography>
                </Box>

                {/* Suggestions List */}
                <Box>
                    {suggestions.map((suggestion) => (
                        <Box key={suggestion.username} sx={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                            <Box sx={{ position: "relative", width: 32, height: 32, marginRight: "12px" }}>
                                <Image
                                    src={suggestion.avatar || "/placeholder.svg"}
                                    alt={suggestion.username}
                                    fill
                                    className={styles.suggestionAvatar}
                                />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ fontWeight: "bold" }}>{suggestion.username}</Typography>
                                <Typography sx={{ color: "text.secondary" }}>{suggestion.relationship}</Typography>
                            </Box>
                            <Button color="primary" size="small">
                                Follow
                            </Button>
                        </Box>
                    ))}
                </Box>

                {/* Footer Links */}
                <Box sx={{ marginTop: "16px" }}>
                    <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                        {footerLinks.slice(0, showAllFooterLinks ? undefined : 5).map((link, index) => (
                            <React.Fragment key={link}>
                                <span>{link}</span>
                                {index < (showAllFooterLinks ? footerLinks.length : 5) - 1 && " • "}
                            </React.Fragment>
                        ))}
                        {!showAllFooterLinks && (
                            <IconButton size="small" onClick={() => setShowAllFooterLinks(true)}>
                                <ChevronDown size={12} />
                            </IconButton>
                        )}
                    </Typography>
                </Box>

                {/* Copyright */}
                <Typography sx={{ fontSize: "12px", color: "text.secondary", marginTop: "8px" }}>
                    © 2025 Instagram from Meta
                </Typography>
            </Box>
        </ThemeProvider>
    )
}
