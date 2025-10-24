'use client';
import { useColorScheme } from '@mui/material/styles';
import { Box, InputBase, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';

interface MessageSendInputProps {
    value?: string;
    handleInput: (event: any) => void;
    handleSendMessage: () => void;
    refreshChatList?: () => void;
    isRefreshing?: boolean;
}   

const MessageSendInput = ({ value, handleInput, handleSendMessage, refreshChatList = () => { }, isRefreshing = false }: MessageSendInputProps) => {
    const { mode } = useColorScheme();
    const themeClass = mode === 'dark' ? 'dark-theme' : 'light-theme';

    return (
        <Box
            sx={{
                padding: '8px 16px',
                borderTop: `1px solid ${themeClass === 'dark-theme' ? '#444' : '#ddd'}`,
                display: 'flex',
                alignItems: 'center',
                background: themeClass === 'dark-theme' ? '#2a2a2a' : '#fff',
            }}
        >
            {/* Desktop Refresh Button */}
            <IconButton
                onClick={refreshChatList}
                disabled={isRefreshing} // Disable while refreshing
                color="primary"
                aria-label="refresh"
            >
                <RefreshIcon />
            </IconButton>

            {/* Message Input */}
            <InputBase
                placeholder="Type your message..."
                fullWidth
                multiline
                value={value}
                onChange={handleInput}
                sx={{
                    flex: 1,
                    marginRight: '8px',
                    padding: '8px',
                    borderRadius: '8px',
                    background: themeClass === 'dark-theme' ? '#333' : '#f0f0f0',
                }}
            />

            {/* Send Button */}
            <IconButton
                color="primary"
                onClick={handleSendMessage}
                sx={{ padding: '8px' }}
            >
                <SendIcon />
            </IconButton>
        </Box>
    )
}

export default MessageSendInput