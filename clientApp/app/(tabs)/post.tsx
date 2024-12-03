import React from 'react';
import { PostContainer, InputWrapper, InputField } from '@/styles/AddPost';
import { FloatingAction } from "react-native-floating-action";
import { Entypo, AntDesign } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

// Actions for this button here..
const actions = [
    {
        text: "Image",
        icon: <Entypo name="folder-images" size={24} color="white" />,
        name: "bt_accessibility",
        position: 2
    },
    {
        text: "Video",
        icon: <Entypo name="folder-video" size={24} color="white" />,
        name: "bt_video",
        position: 1
    },
    {
        text: "File",
        icon: <AntDesign name="addfile" size={24} color="white" />,
        name: "bt_file",
        position: 3
    }
];

// Add Post Component..
const Post = () => {
    const colorScheme = useColorScheme();
    let floatingAction = null;

    return (
        <PostContainer>
            <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} />
            
            <InputWrapper>
                <InputField
                    placeholder="What's on your mind?"
                    multiline
                    numberOfLines={8}
                />
            </InputWrapper>

            <FloatingAction
                ref={(ref) => { floatingAction = ref; }}
                actions={actions}
            />
        </PostContainer>
    );
};

export default Post;