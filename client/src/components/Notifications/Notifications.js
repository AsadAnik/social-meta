import React from 'react';
import { Avatar, Box, Card, Chip, Typography, styled } from '@mui/material';

const TimelineDot = styled('div')({
  position: 'absolute',
  left: -4,
  top: 6,
  width: 8,
  height: 8,
  borderRadius: '50%',
  border: '2px solid white',
  outline: '1px solid #E5E7EB',
  backgroundColor: '#4B96F3',
});

const TimelineConnector = styled('div')({
  position: 'absolute',
  left: -1,
  top: 0,
  bottom: 0,
  width: 2,
  backgroundColor: '#E5E7EB',
});

const NotificationCard = styled(Card)({
  maxWidth: 800,
  margin: 'auto',
  backgroundColor: '#F8F9FA',
  boxShadow: 'none',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
});

const StyledChip = styled(Chip)({
  height: 20,
  fontSize: '0.75rem',
  borderRadius: 12,
  padding: '0 8px',
});

const NotificationItem = ({ date, children }) => (
  <Box sx={{ position: 'relative', pl: 4, pb: 3 }}>
    <TimelineConnector />
    <TimelineDot />
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Typography 
        color="text.secondary" 
        sx={{ 
          fontSize: '0.75rem', 
          minWidth: 80,
          mt: 0.5,
          color: '#6B7280'
        }}
      >
        {date}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  </Box>
);

export default function NotificationFeed() {
  return (
    <NotificationCard>
      <Box sx={{ p: 3 }}>
        <NotificationItem date="May 21, 2015">
          <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #E5E7EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>MJ</Avatar>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Mad Jack</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>added you to the board</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#4B96F3' }}>The treasure of the three witches</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'right', mt: 1 }}>9:40 AM</Typography>
          </Box>
        </NotificationItem>

        <NotificationItem date="May 20, 2015">
          <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #E5E7EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>SN</Avatar>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Snuck</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>commented on</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#4B96F3' }}>Adventures on the high seas</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', my: 1.5 }}>
              "Can't wait to go on this adventure with you, captain. It's an honor and a privilege to serve as your first mate.."
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'right' }}>4:42 PM</Typography>
          </Box>
        </NotificationItem>

        <NotificationItem date="April 8, 2015">
          <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #E5E7EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>AD</Avatar>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Angus Dagnabbit</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>moved</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#4B96F3' }}>Pirate's treasure</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>from</Typography>
              <StyledChip 
                label="In progress" 
                sx={{ 
                  bgcolor: '#FEF3C7',
                  color: '#D97706',
                  border: '1px solid #FDE68A'
                }} 
              />
              <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>to</Typography>
              <StyledChip 
                label="Done" 
                sx={{ 
                  bgcolor: '#D1FAE5',
                  color: '#059669',
                  border: '1px solid #A7F3D0'
                }} 
              />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'right', mt: 1 }}>2:09 PM</Typography>
          </Box>
        </NotificationItem>

        <NotificationItem date="April 6, 2015">
          <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, border: '1px solid #E5E7EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24 }}>FD</Avatar>
              <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>Flash Dashing</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#6B7280' }}>uploaded 4 new screenshots to the board</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#4B96F3' }}>Steal Mad Jack's treasure again</Typography>
            </Box>
            
            <Typography sx={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'right', mt: 1 }}>4:22 AM</Typography>
          </Box>
        </NotificationItem>
      </Box>
    </NotificationCard>
  );
}