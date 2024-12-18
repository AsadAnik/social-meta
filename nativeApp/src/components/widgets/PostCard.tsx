import React from 'react';
import {
    Card,
    UserInfo,
    UserImg,
    UserInfoText,
    UserName,
    PostTime,
    PostText,
    PostImg,
    InteractionWrapper,
    Interaction,
    InteractionText,
    Divider
} from '../../styles/FeedStyles';
// import { Ionicons } from '@expo/vector-icons';
import { Card as PaperCard } from 'react-native-paper';



const PostCard = ({ item }: any) => {
    // Image Or Divider Rendering Function..
    const renderImageOrDivider = (image: any) => {
        if (!image) {
            return (
                <Divider />
            );
        } else {
            return (
                <PostImg source={image} />
            );
        }
    };

    // liked or not liked post..
    const likeIcon = item.liked ? 'heart' : 'heart-outline';
    const likeIconColor = item.liked ? 'red' : '#333';

    // Show likes or like in case and comments or comment in cases..
    // Case Of Like..
    let likeText, commentText;
    if (item.likes == 1) {
        likeText = '1 Like';
    } else if (item.likes > 1) {
        likeText = item.likes + ' Likes';
    } else {
        likeText = 'Like';
    }

    // Case of Comment..
    if (item.comments == 1) {
        commentText = '1 Comment';
    } else if (item.comments > 1) {
        commentText = item.comments + ' Comments';
    } else {
        commentText = 'Comment';
    }

    return (
        <Card>
            <PaperCard>
                {/* ----- User Info and Image ---- */}
                <UserInfo>
                    <UserImg source={item.userImg} />

                    <UserInfoText>
                        <UserName>{item.userName}</UserName>
                        <PostTime>{item.postTime}</PostTime>
                    </UserInfoText>
                </UserInfo>

                {/* ----- Post Text / Body ----- */}
                <PostText>{item.post}</PostText>

                {/* ---- Post Image Or Divider ---- */}
                {renderImageOrDivider(item.postImg)}

                {/* ---- Likes & Comments Wrapper ---- */}
                <InteractionWrapper>
                    <Interaction active={item.liked}>
                        {/* <Ionicons name={likeIcon} size={24} color={likeIconColor} /> */}
                        <InteractionText active={item.liked}>{likeText}</InteractionText>
                    </Interaction>

                    <Interaction>
                        {/* <Ionicons name="chatbubbles-outline" size={24} color="black" /> */}
                        <InteractionText>{commentText}</InteractionText>
                    </Interaction>
                </InteractionWrapper>
            </PaperCard>
        </Card>
    );
};

export default PostCard;