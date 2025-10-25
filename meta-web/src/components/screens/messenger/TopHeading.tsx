import { useColorScheme } from '@mui/material/styles';
import { Typography, Avatar, Box } from '@mui/material';
import { ModeSwitch } from '../../widgets';

const TopHeading = () => {
  const { mode } = useColorScheme();
  const themeClass = mode === 'dark' ? 'dark-theme' : 'light-theme';

  return (
    <Box
      sx={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${themeClass === 'dark-theme' ? '#444' : '#ddd'}`,
      }}
    >
      <Avatar
        alt="User Avatar"
        src="https://avatars.githubusercontent.com/u/80540635?v=4"
        sx={{ marginRight: '16px' }}
      />
      <Typography variant="h6">Burhan</Typography>


      {/* Mode Theme Switch */}
      <Box sx={{ marginLeft: 'auto' }}>
        <ModeSwitch />
      </Box>
    </Box>
  )
}

export default TopHeading