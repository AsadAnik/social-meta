"use client";
import React, { useState } from "react";
import { AppBarComponent } from "@/components/common";
import Sidebar from "@/components/common/Sidebar";
import ActiveFriends from "@/components/common/ActiveSidebar";
import { Box, useMediaQuery, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// region LAYOUT COMPONENT
const HomeLayout = (props: { children: React.ReactNode }) => {
    const isUltraWide = useMediaQuery("(min-width: 1920px)");
    const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isSmallMobile = useMediaQuery("(max-width: 320px)");

    const [openLeftSidebar, setOpenLeftSidebar] = useState(false);
    const [openRightSidebar, setOpenRightSidebar] = useState(false);

    // region Main UI
    return (
        <AppBarComponent>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    height: "87vh",
                    overflow: "hidden",
                    position: "relative",
                    width: isTabletOrMobile ? "auto" : "100vw",
                }}
            >
                {/* Sidebar Toggle Buttons (Visible on Small Screens) */}
                {isTabletOrMobile && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            position: "fixed",
                            top: 10,
                            left: 0,
                            right: 0,
                            zIndex: 1200,
                        }}
                    >
                        <IconButton
                            onClick={() => setOpenLeftSidebar(true)}
                            sx={{
                                bgcolor: "white",
                                boxShadow: 2,
                                width: isSmallMobile ? 30 : 40,
                                height: isSmallMobile ? 30 : 40
                            }}
                        >
                            <MenuIcon sx={{fontSize: isSmallMobile ? 18 : 24}} />
                        </IconButton>
                        <IconButton
                            onClick={() => setOpenRightSidebar(true)}
                            sx={{
                                bgcolor: "white",
                                boxShadow: 2,
                                position: 'relative',
                                right: 10,
                                height: isSmallMobile ? 30 : 40,
                            }}
                        >
                            <MenuIcon sx={{fontSize: isSmallMobile ? 18 : 24}} />
                        </IconButton>
                    </Box>
                )}

                {/* ==== Left Sidebar - Drawer for Small Screens ==== */}
                {isTabletOrMobile ? (
                    <Drawer anchor="left" open={openLeftSidebar} onClose={() => setOpenLeftSidebar(false)}>
                        <Box sx={{width: isSmallMobile ? 180 : 250, p: 2}}>
                            <ActiveFriends />
                        </Box>
                    </Drawer>
                ) : (
                    <Box
                        sx={{
                            width: isUltraWide ? 350 : 400,
                            p: 1,
                            flexShrink: 0,
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <ActiveFriends />
                    </Box>
                )}

                {/* ==== Main Content Area ==== */}
                <Box
                    sx={{
                        flex: 1,
                        maxWidth: isTabletOrMobile ? (isUltraWide ? 1200 : "100%") : "none",
                        height: "100%",
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    {props.children}
                </Box>

                {/* ==== Right Sidebar - Drawer for Small Screens ==== */}
                {isTabletOrMobile ? (
                    <Drawer anchor="right" open={openRightSidebar} onClose={() => setOpenRightSidebar(false)}>
                        <Box sx={{width: isSmallMobile ? 220 : 280, p: 2}}>
                            <Sidebar />
                        </Box>
                    </Drawer>
                ) : (
                    <Box
                        sx={{
                            width: isUltraWide ? 400 : 450,
                            // p: 2,
                            flexShrink: 1,
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <Sidebar />
                    </Box>
                )}
            </Box>
        </AppBarComponent>
    );
};

export default HomeLayout;
