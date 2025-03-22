"use client";
import { AppBarComponent } from "@/components/common";
import Sidebar from "@/components/common/Sidebar";
import ActiveFriends from "@/components/common/ActiveSidebar";
import { Box, useMediaQuery, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const HomeLayout = (props: { children: React.ReactNode }) => {
  const isUltraWide = useMediaQuery("(min-width: 1920px)"); 
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)"); 
  const isMobile = useMediaQuery("(max-width: 768px)"); 
  const isSmallMobile = useMediaQuery("(max-width: 320px)");

  const [openLeftSidebar, setOpenLeftSidebar] = useState(false);
  const [openRightSidebar, setOpenRightSidebar] = useState(false);

  return (
    <AppBarComponent>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "87vh",
          overflow: "hidden",
          position: "relative",
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
              sx={{ bgcolor: "white", boxShadow: 2, width: isSmallMobile ? 30 : 40, height: isSmallMobile ? 30 : 40 }}
            >
              <MenuIcon sx={{ fontSize: isSmallMobile ? 18 : 24 }} />
            </IconButton>
            <IconButton 
              onClick={() => setOpenRightSidebar(true)} 
              sx={{ bgcolor: "white", boxShadow: 2, position: 'relative', right: 10, height: isSmallMobile ? 30 : 40, }}
            >
              <MenuIcon sx={{ fontSize: isSmallMobile ? 18 : 24 }} />
            </IconButton>
          </Box>
        )}

        {/* Left Sidebar - Drawer for Small Screens */}
        {isTabletOrMobile ? (
          <Drawer anchor="left" open={openLeftSidebar} onClose={() => setOpenLeftSidebar(false)}>
            <Box sx={{ width: isSmallMobile ? 180 : 250, p: 2 }}>
              <ActiveFriends />
            </Box>
          </Drawer>
        ) : (
          <Box
            sx={{
              width: isUltraWide ? 300 : 250, 
              p: 1,
              borderRight: "1px solid #ddd",
              flexShrink: 0,
              height: "100vh",
              position: "relative",
            }}
          >
            <ActiveFriends />
          </Box>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isUltraWide ? 1200 : "100%", 
            height: "90vh",
            overflowY: "auto",
          }}
        >
          {props.children}
        </Box>

        {/* Right Sidebar - Drawer for Small Screens */}
        {isTabletOrMobile ? (
          <Drawer anchor="right" open={openRightSidebar} onClose={() => setOpenRightSidebar(false)}>
            <Box sx={{ width: isSmallMobile ? 220 : 'none', p: 2 }}>
              <Sidebar />
            </Box>
          </Drawer>
        ) : (
          <Box
            sx={{
              width: isUltraWide ? 400 : 380, 
              // p: 2,
              borderLeft: "1px solid #ddd",
              flexShrink: 1,
              height: "100vh",
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
