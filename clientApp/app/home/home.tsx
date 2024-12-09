import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import PostCard from '@/components/widgets/PostCard';
import { Container } from '@/styles/FeedStyles';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme.web';

// Some fake Data..
// region Fake Data
const postData = [
    {
        id: '1',
        userName: 'Asad Anik',
        userImg: require('@/assets/images/asadanik.jpg'),
        postTime: '2 hours ago',
        post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
        postImg: require('@/assets/images/post2.jpg'),
        liked: true,
        likes: 77,
        comments: 5
    },
    {
        id: '2',
        userName: 'Arafat Armaan',
        userImg: require('@/assets/images/avatar-male.png'),
        postTime: '1 day ago',
        post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
        postImg: require('@/assets/images/post1.jpg'),
        liked: true,
        likes: 1,
        comments: 0
    },
    {
        id: '3',
        userName: 'Tanzid Hasan',
        userImg: require('@/assets/images/avatar-male.png'),
        postTime: '4 days ago',
        post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
        postImg: require('@/assets/images/post3.jpg'),
        liked: false,
        likes: 0,
        comments: 2
    },
    {
        id: '4',
        userName: 'Alena Jeene',
        userImg: require('@/assets/images/alenajeene.jpeg'),
        postTime: '10 days ago',
        post: 'Interaction is normal, i don\'t cares all of this shades. Because there is blue and black shades interactions conflicting with each others.',
        postImg: '',
        liked: false,
        likes: 231,
        comments: 25
    }
];

// region Home Component
const HomeTabScreen = ({ navigation }: any) => {
    const colorScheme = useColorScheme();

    return (
        <Container>
            <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />

            <FlatList
                refreshControl={<RefreshControl refreshing={false} />}
                data={postData}
                renderItem={({ item }) => <PostCard item={item} />}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
            />
        </Container>
    );
};

export default HomeTabScreen;