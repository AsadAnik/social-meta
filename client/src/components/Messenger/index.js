import React, { useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardContent,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery
} from "@mui/material";
import {
  ChevronLeft,
  Clock,
  FileText,
  Image,
  MessageSquare,
  Search,
  Send,
  Smile,
  Users,
  Video
} from "lucide-react";

export default function Messenger() {
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 1200,
        height: isSmallScreen ? "auto" : 700,
        display: "grid",
        gridTemplateColumns: isSmallScreen
          ? "1fr"
          : sidebarOpen
          ? "280px 1fr 64px"
          : "1fr 64px",
        backgroundColor: "#F8FAFC",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      {/* Left Sidebar */}
      {(!isSmallScreen || sidebarOpen) && (
        <Box
          sx={{
            borderRight: 1,
            borderColor: "divider",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Typography variant="subtitle1" fontWeight="bold">
              Chat
            </Typography>
          </Box>

          {/* Profile Section */}
          <Box textAlign="center">
            <Avatar sx={{ width: 64, height: 64, mx: "auto" }}>JA</Avatar>
            <Typography variant="h6">Jontray Arnold</Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#4FD1C5",
                backgroundColor: "#E6FFFA",
                borderRadius: 2,
                px: 1,
              }}
            >
              available
            </Typography>
          </Box>

          {/* Search */}
          <Box sx={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                top: 12,
                left: 0,
                color: "gray",
              }}
            />
            <TextField placeholder="Search" fullWidth size="small" sx={{ pl: 2 }} />
          </Box>

          {/* Chat List */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="body2" color="textSecondary">
              Last chats
            </Typography>
            <Button variant="outlined" size="small">
              +
            </Button>
          </Box>

          <Box sx={{ overflowY: "auto", flex: 1 }}>
            {["Kate Johnson", "Tamara Shewchenko", "Joshua Clarkson", "Jeroen Zeet"].map(
              (name, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  p={1}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.05)",
                      borderRadius: 2,
                    },
                  }}
                >
                  <Avatar>{name[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle2">{name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Last message preview...
                    </Typography>
                  </Box>
                </Box>
              )
            )}
          </Box>
        </Box>
      )}

      {/* Main Chat Area */}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6">Group Chat</Typography>
        </Box>

        <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="chat tabs">
            <Tab label="Messages" />
            <Tab label="Participants" />
          </Tabs>

          {activeTab === 0 && (
            <Box
              mt={2}
              sx={{
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
              }}
            >
              {/* Chat Messages */}
              <Box display="flex" gap={2} mb={2}>
                <Avatar>KJ</Avatar>
                <Box>
                  <Typography variant="subtitle2">Kate Johnson</Typography>
                  <Typography variant="caption" color="textSecondary">
                    11:24 AM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ backgroundColor: "#fff", p: 1, borderRadius: 2, mt: 1 }}
                  >
                    Hi everyone, let's start the call soon 👋
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <Avatar>KJ</Avatar>
                <Box>
                  <Typography variant="subtitle2">Kate Johnson</Typography>
                  <Typography variant="caption" color="textSecondary">
                    11:24 AM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ backgroundColor: "#fff", p: 1, borderRadius: 2, mt: 1 }}
                  >
                    Hi everyone, let's start the call soon 👋
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <Avatar>KJ</Avatar>
                <Box>
                  <Typography variant="subtitle2">Kate Johnson</Typography>
                  <Typography variant="caption" color="textSecondary">
                    11:24 AM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ backgroundColor: "#fff", p: 1, borderRadius: 2, mt: 1 }}
                  >
                    Hi everyone, let's start the call soon 👋
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <Avatar>KJ</Avatar>
                <Box>
                  <Typography variant="subtitle2">Kate Johnson</Typography>
                  <Typography variant="caption" color="textSecondary">
                    11:24 AM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ backgroundColor: "#fff", p: 1, borderRadius: 2, mt: 1 }}
                  >
                    Hi everyone, let's start the call soon 👋
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <Avatar>KJ</Avatar>
                <Box>
                  <Typography variant="subtitle2">Kate Johnson</Typography>
                  <Typography variant="caption" color="textSecondary">
                    11:24 AM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ backgroundColor: "#fff", p: 1, borderRadius: 2, mt: 1 }}
                  >
                    Hi everyone, let's start the call soon 👋
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <Avatar>KJ</Avatar>
                <Box>
                  <Typography variant="subtitle2">Kate Johnson</Typography>
                  <Typography variant="caption" color="textSecondary">
                    11:24 AM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ backgroundColor: "#fff", p: 1, borderRadius: 2, mt: 1 }}
                  >
                    Hi everyone, let's start the call soon 👋
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <Avatar>KJ</Avatar>
                <Box>
                  <Typography variant="subtitle2">Kate Johnson</Typography>
                  <Typography variant="caption" color="textSecondary">
                    11:24 AM
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ backgroundColor: "#fff", p: 1, borderRadius: 2, mt: 1 }}
                  >
                    Hi everyone, let's start the call soon 👋
                  </Typography>
                </Box>
              </Box>
              {/* Add more message boxes */}
            </Box>
          )}

          {activeTab === 1 && (
            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Participants list would go here
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Box display="flex" gap={1} alignItems="center">
            <TextField placeholder="Write your message..." fullWidth size="small" />
            <Button variant="contained" color="primary">
              <Smile size={16} />
            </Button>
            <Button variant="contained" color="primary">
              <Send size={16} />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          borderLeft: 1,
          borderColor: "divider",
          p: 2,
          display: isSmallScreen ? "none" : "block",
        }}
      >
        <AvatarGroup max={3}>
          <Avatar>
            <MessageSquare size={16} />
          </Avatar>
          <Avatar>
            <Users size={16} />
          </Avatar>
          <Avatar>
            <FileText size={16} />
          </Avatar>
          <Avatar>
            <Image size={16} />
          </Avatar>
          <Avatar>
            <Video size={16} />
          </Avatar>
          <Avatar>
            <Clock size={16} />
          </Avatar>
        </AvatarGroup>
      </Box>
    </Card>
  );
}
