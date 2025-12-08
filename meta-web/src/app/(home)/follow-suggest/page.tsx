"use client";

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Card,
    Avatar,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Mock data for user suggestions. You can replace this with your API data.
const initialSuggestedUsers = [
    {
        id: 1,
        name: 'John Doe',
        title: 'Software Engineer at Meta',
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        isFollowing: false,
    },
    {
        id: 2,
        name: 'Jane Smith',
        title: 'Product Manager at Google',
        avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        isFollowing: false,
    },
    {
        id: 3,
        name: 'Peter Jones',
        title: 'UX Designer at Apple',
        avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
        isFollowing: true, // Example of a user already being followed
    },
    {
        id: 4,
        name: 'Maria Garcia',
        title: 'Data Scientist at Netflix',
        avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
        isFollowing: false,
    },
    {
        id: 5,
        name: 'Sam Wilson',
        title: 'DevOps Specialist at Amazon',
        avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
        isFollowing: false,
    },
];

const FollowSuggestPage = () => {
    const [suggestedUsers, setSuggestedUsers] = useState(initialSuggestedUsers);
    const theme = useTheme();

    const handleFollowToggle = (userId: number) => {
        setSuggestedUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
            )
        );
        // Here you would typically dispatch an API call to follow/unfollow the user
        // For example: followUser(userId) or unfollowUser(userId)
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[2], p: { xs: 2, md: 3 } }}>
                <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                    Suggestions For You
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    People you might want to connect with based on your interests.
                </Typography>
                <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
                    {suggestedUsers.map((user, index) => (
                        <React.Fragment key={user.id}>
                            <ListItem
                                alignItems="center"
                                sx={{ py: 2, '&:hover': { backgroundColor: theme.palette.action.hover } }}
                                secondaryAction={
                                    <Button
                                        variant={user.isFollowing ? 'outlined' : 'contained'}
                                        size="small"
                                        onClick={() => handleFollowToggle(user.id)}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '20px',
                                            fontWeight: 'bold',
                                            minWidth: '100px',
                                        }}
                                    >
                                        {user.isFollowing ? 'Following' : 'Follow'}
                                    </Button>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar alt={user.name} src={user.avatarUrl} sx={{ width: 50, height: 50 }} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {user.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            {user.title}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < suggestedUsers.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Card>
        </Container>
    );
};

export default FollowSuggestPage;
