import { AppBarComponent } from '@/components/common';
import { Box } from '@mui/material';
import ActiveFriends from '@/components/common/Sidebar/ActiveSidebar';

const NotificationLayout = (props: { children: React.ReactNode }) => {
    return (
        <AppBarComponent>

            {/* Main content area */}
            <Box sx={{ flex: 1, p: 2 }}>
                {props.children}
            </Box>


        </AppBarComponent>
    );
};

export default NotificationLayout;
