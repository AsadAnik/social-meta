import React, { useState } from 'react';
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
    Divider,
} from '../../styles/FeedStyles.ts';
import { Card as PaperCard } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { useLikePostMutation } from '../../redux/slice/post.slice.ts';

// Define types for better type safety
interface PostItem {
    _id: string;
    userName: string;
    userImg: any;
    postTime: string;
    post: string;
    image?: any;
    liked: boolean;
    likes: number;
    comments: number;
    rawData?: any;
}

interface PostCardProps {
    item: PostItem;
    onOptionsPress?: () => void;
    onCommentPress?: () => void;
    onSharePress?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
    item,
    onOptionsPress,
    onCommentPress,
    onSharePress
}) => {
    // Local state to handle UI updates immediately
    const [liked, setLiked] = useState<boolean>(item.liked);
    const [likeCount, setLikeCount] = useState<number>(item.likes);

    // RTK Query hook for liking posts
    const [likePost] = useLikePostMutation();

    // Handle like post action
    const handleLikePost = async () => {
        try {
            // Optimistic update
            const newLikedState = !liked;
            const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;

            setLiked(newLikedState);
            setLikeCount(newLikeCount);

            // Call API to update like status
            await likePost({
                postId: item._id,
                action: newLikedState ? 'like' : 'unlike'
            }).unwrap();

        } catch (error) {
            // Revert on error
            console.error('Error updating like status:', error);
            setLiked(liked);
            setLikeCount(likeCount);
            Alert.alert('Error', 'Failed to update like status');
        }
    };

    // Format like text based on count
    const formatLikeText = (count: number): string => {
        if (count === 0) return 'Like';
        if (count === 1) return '1 Like';
        return `${count} Likes`;
    };

    // Format comment text based on count
    const formatCommentText = (count: number): string => {
        if (count === 0) return 'Comment';
        if (count === 1) return '1 Comment';
        return `${count} Comments`;
    };

    // Determine like icon and color
    const likeIcon = liked ? 'heart' : 'hearto';
    const likeIconColor = liked ? '#FF3B30' : '#333';

    return (
        <Card>
            <PaperCard elevation={2} style={styles.paperCard}>
                {/* User Info Section */}
                <UserInfo>
                    <UserImg source={item.userImg} />
                    <UserInfoText>
                        <UserName>{item.userName}</UserName>
                        <PostTime>{item.postTime}</PostTime>
                    </UserInfoText>

                    {onOptionsPress && (
                        <TouchableOpacity
                            style={styles.optionsButton}
                            onPress={onOptionsPress}
                        >
                            <MaterialCommunityIcons name="dots-vertical" size={22} color="#666" />
                        </TouchableOpacity>
                    )}
                </UserInfo>

                {/* Post Content */}
                <PostText>{item.post}</PostText>

                {/* Post Image or Divider */}
                {item.image ? (
                    <PostImg source={item.image} resizeMode="cover" />
                ) : (
                    <Divider />
                )}

                {/* Interaction Section */}
                <InteractionWrapper>
                    {/* Like Button */}
                    <Interaction active={liked} onPress={handleLikePost}>
                        <AntDesign name={likeIcon} size={22} color={likeIconColor} />
                        <InteractionText active={liked}>
                            {formatLikeText(likeCount)}
                        </InteractionText>
                    </Interaction>

                    {/* Comment Button */}
                    <Interaction onPress={onCommentPress}>
                        <Ionicons name="chatbubble-outline" size={22} color="#333" />
                        <InteractionText>
                            {formatCommentText(item.comments)}
                        </InteractionText>
                    </Interaction>

                    {/* Share Button */}
                    <Interaction onPress={onSharePress}>
                        <Ionicons name="share-social-outline" size={22} color="#333" />
                        <InteractionText>Share</InteractionText>
                    </Interaction>
                </InteractionWrapper>
            </PaperCard>
        </Card>
    );
};

const styles = StyleSheet.create({
    paperCard: {
        borderRadius: 10,
        marginBottom: 0,
        padding: 0,
    },
    optionsButton: {
        marginLeft: 'auto',
        padding: 8,
    },
});

export default PostCard;
