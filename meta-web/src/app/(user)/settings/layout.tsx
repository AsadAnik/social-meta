"use client";
import React, { useState } from "react";
import { Box, Container, Drawer, IconButton, useMediaQuery } from "@mui/material";
import SettingItem from "@/components/SettingItem";
import { AppBarComponent } from "@/components/common";
import { Menu as MenuIcon } from "@mui/icons-material";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppBarComponent>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "background.default" }}>
        
        {/* Sidebar Toggle Button (Visible on Small Screens) */}
        {isTabletOrMobile && (
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1300,
              bgcolor: "white",
              boxShadow: 2,
              width: isMobile ? 30 : 40,
              height: isMobile ? 30 : 40,
            }}
          >
            <MenuIcon sx={{ fontSize: isMobile ? 18 : 24 }} />
          </IconButton>
        )}

        {/* Sidebar for Desktop */}
        {!isTabletOrMobile && (
          <Box
            sx={{
              width: 280,
              height: "100vh",
              position: "fixed",
              top: 0,
              left: 0,
              bgcolor: "background.paper",
              borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <SettingItem />
          </Box>
        )}

        {/* Sidebar for Mobile (Drawer) */}
        {isTabletOrMobile && (
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            PaperProps={{
              sx: {
                width: 250, // Ensure proper width
                bgcolor: "background.paper",
              },
            }}
          >
            <Box sx={{ width: 250 }}>
              <SettingItem /> {/* Make sure SettingItem renders inside Drawer */}
            </Box>
          </Drawer>
        )}

        {/* Main Content */}
        <Container
          sx={{
            flex: 1,
            ml: { md: "280px" }, 
            p: 3,
            overflowY: "auto",
            height: "100vh",
          }}
        >
          {children}
        </Container>
      </Box>
    </AppBarComponent>
  );
};

export default SettingsLayout;
