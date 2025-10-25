'use client';
import { Sidebar } from 'react-pro-sidebar';
import { ChatItem } from 'react-chat-elements';
import { useColorScheme } from '@mui/material/styles';
import { Paper, Typography, Box, CircularProgress, IconButton } from '@mui/material';
import { Searchbar } from '@/components/widgets';
import { useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import PublicIcon from '@mui/icons-material/Public';
import { useRouter } from 'next/navigation';


const SidebarChat = () => {
    const { mode } = useColorScheme();
    const router = useRouter();
    // Determine if we are in dark mode or light mode
    const themeClass = mode === 'dark' ? 'dark-theme' : 'light-theme';

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [chatList, setChatList] = useState([
        {
            id: "123456",
            avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
            title: "Kursat",
            subtitle: "Ok. See you!",
            date: new Date(),
            unread: 0,
        },
        {
            id: "654321",
            avatar: "https://avatars.githubusercontent.com/u/41473129?v=4",
            title: "Emre",
            subtitle: "What are you doing ?",
            date: new Date(),
            muted: true,
            showMute: true,
            unread: 2,
        },
    ]);

    // Function to refresh the chat list
    const refreshChatList = async () => {
        setIsRefreshing(true);
        // Simulate API call delay
        setTimeout(() => {
            // Add a new dummy chat item
            setChatList((prev) => [
                {
                    id: Date.now().toString(),
                    avatar: "https://avatars.githubusercontent.com/u/12345?v=4",
                    title: "New User",
                    subtitle: "Hey there!",
                    date: new Date(),
                    unread: 3,
                },
                ...prev,
            ]);
            setIsRefreshing(false);
        }, 1500);
    };

    return (
        <Paper elevation={3} sx={{ height: '100%' }}>
            <Sidebar style={{ width: '100%', backgroundColor: 'transparent', borderColor: 'transparent' }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    className={`${themeClass}`}
                    sx={{ padding: '16px', marginTop: '0 !important', paddingTop: '24px' }}
                >
                    {/* Desktop Refresh Button */}
                    <IconButton
                        onClick={() => router.push('/')}
                        color="primary"
                    >
                        <PublicIcon />
                    </IconButton>

                    <Typography variant="h4">Chats</Typography>

                    {/* Desktop Refresh Button */}
                    <IconButton
                        onClick={refreshChatList}
                        disabled={isRefreshing} // Disable while refreshing
                        color="primary"
                        aria-label="refresh"
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>

                {/* Searchbar */}
                <Box sx={{ padding: '0 16px' }}>
                    <Searchbar />
                </Box>

                {/* Refreshable Chat List */}
                <Box
                    sx={{
                        overflow: 'auto',
                        height: 'calc(100vh - 145px)', // Adjust height to leave space for header
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onTouchEnd={refreshChatList} // Mobile swipe refresh
                >
                    {/* Show loader while refreshing */}
                    {isRefreshing && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}

                    <div className={`${themeClass}`}>
                        {chatList.map((chat) => (
                            <ChatItem
                                onClick={() => router.push(`/messenger/${chat.id}`)}
                                key={chat.id}
                                id={chat.id}
                                avatar={chat.avatar}
                                alt={chat.title}
                                title={chat.title}
                                subtitle={chat.subtitle}
                                date={chat.date}
                                unread={chat.unread}
                                muted={chat.muted}
                                showMute={chat.showMute}
                            // showVideoCall={true}
                            />
                        ))}
                    </div>
                </Box>
            </Sidebar>
        </Paper>
    );
};

export default SidebarChat;
