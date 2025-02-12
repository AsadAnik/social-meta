import { AppBarComponent } from '@/components/common';
import Sidebar from '@/components/common/Sidebar';
import { Box } from '@mui/material';

const HomeLayout = (props: { children: React.ReactNode }) => {
  return (
    <AppBarComponent>
      {/* Flexbox container for main content and sidebar */}
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        {/* Main content area */}
        <Box sx={{ flex: 1, p: 2 }}>
          {props.children}
        </Box>

        {/* Sidebar on the right */}
        <Box>
          <Sidebar />
        </Box>
      </Box>
    </AppBarComponent>
  );
};

export default HomeLayout;
