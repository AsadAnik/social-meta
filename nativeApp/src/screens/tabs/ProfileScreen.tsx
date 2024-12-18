import React from 'react';
import { ScrollView, FlatList, View, RefreshControl } from 'react-native';
import ProfileHeaderUI from '../../components/ui/ProfileHeaderUI';
import PostCard from '../../components/widgets/PostCard';
import { Container } from '../../styles/ProfileStyles';

const postData = [
    {
        id: '1',
        userName: 'Asad Anik',
        // userImg: require('@/assets/images/asadanik.jpg'),
        postTime: '2 hours ago',
        post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
        // postImg: require('@/assets/images/post2.jpg'),
        liked: true,
        likes: 77,
        comments: 5
    },
    {
        id: '2',
        userName: 'Asad Anik',
        // userImg: require('@/assets/images/asadanik.jpg'),
        postTime: '4 hours ago',
        post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
        // postImg: require('@/assets/images/post3.jpg'),
        liked: false,
        likes: 77,
        comments: 5
    },
    {
        id: '3',
        userName: 'Asad Anik',
        // userImg: require('@/assets/images/asadanik.jpg'),
        postTime: '1 day ago',
        post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
        // postImg: require('../assets/images/post2.jpg'),
        liked: false,
        likes: 1,
        comments: 0
    },
];

const ProfileTabScreen = (props: any) => {
    // const colorScheme = useColorScheme();

    return (
        <Container>
            {/* <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} /> */}
            
            <ScrollView 
                style={{ backgroundColor: 'white' }} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {}}
                    />
                }
            >
                <ProfileHeaderUI {...props} type="OWN" />

                <FlatList
                    data={postData}
                    renderItem={({ item }) => <PostCard item={item} />}
                    keyExtractor={item => item.id}
                    // showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    style={{ padding: 10 }}
                />

            </ScrollView>
        </Container>
    );
};

export default ProfileTabScreen;