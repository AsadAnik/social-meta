import React from 'react';
import { Paper, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const EmptyChat = () => {
    
    return (
        <Paper elevation={3} sx={{ height: '100%', paddingTop: '25%' }}>
            {/* Empty Interface */}
            <ChatIcon sx={{ fontSize: '100px', margin: 'auto', display: 'block', color: 'gray' }} />
            <Typography variant="h4" sx={{ padding: '16px', textAlign: 'center', color: 'gray' }}>
                Select Chat & Start Typing
            </Typography>
        </Paper>
    )
}

export default EmptyChat