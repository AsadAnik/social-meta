// import "react-chat-elements/dist/main.css"; // USING CUSTOM CSS FROM THE LIBRARY FOR DARK MODE IS MISSING INTO THE LIBRARY..
import React from 'react';
import { Grid } from '@mui/material';
import { SidebarChat } from '@/components/screens/messenger';

const MessengerLayout = (props: { children: React.ReactNode }) => {
    return (
        <React.Fragment>
            <Grid container spacing={2} sx={{ height: '100vh' }}>
                {/* Sidebar with Chats to Pickup */}
                <Grid item xs={12} sm={4} md={3}>
                    <SidebarChat />
                </Grid>

                {/* Middle Content for Messagging (Chat area) */}
                <Grid item xs={12} sm={8} md={9}>
                    {/* <MessagesChat /> */}
                    {props.children}
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default MessengerLayout;