import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

// Types for story content
type StoryContent = {
    type: 'image' | 'video';
    url: string;
    duration: number; // Duration in seconds
};

// Types for a single user's story data
type Story = {
    id: number;
    userName: string;
    avatar: string;
    content: StoryContent[];
};

// Props for Stories component
interface StoriesProps {
    stories: Story[];
    onAllStoriesEnd?: () => void;
}

// Default stories data
const storiesData: Story[] = [
    {
        id: 1,
        userName: 'User One',
        avatar: 'https://placekitten.com/100/100',
        content: [
            { type: 'image', url: 'https://placekitten.com/800/400', duration: 5 },
            { type: 'video', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 10 },
        ],
    },
    {
        id: 2,
        userName: 'User Two',
        avatar: 'https://placekitten.com/101/101',
        content: [
            { type: 'image', url: 'https://placekitten.com/801/400', duration: 5 },
        ],
    },
];

const Stories: React.FC<StoriesProps> = ({ stories = storiesData, onAllStoriesEnd }) => {
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentStory, setCurrentStory] = useState(0);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isStoryOpen) {
            startProgressTimer();
        } else {
            clearInterval(progressInterval.current as NodeJS.Timeout);
        }
        return () => clearInterval(progressInterval.current as NodeJS.Timeout);
    }, [isStoryOpen, currentStory]);

    const startProgressTimer = () => {
        clearInterval(progressInterval.current as NodeJS.Timeout);
        const story = stories[currentIndex]?.content[currentStory];
        if (!story) return;

        progressInterval.current = setTimeout(() => {
            onNextStory();
        }, story.duration * 1000);
    };

    const onNextStory = () => {
        const storyCount = stories[currentIndex]?.content.length || 0;
        if (currentStory < storyCount - 1) {
            setCurrentStory((prev) => prev + 1);
        } else {
            onNextUser();
        }
    };

    const onPrevStory = () => {
        if (currentStory > 0) {
            setCurrentStory((prev) => prev - 1);
        } else if (currentIndex > 0) {
            onPrevUser();
        }
    };

    const onNextUser = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setCurrentStory(0);
        } else {
            clearInterval(progressInterval.current as NodeJS.Timeout);
            onAllStoriesEnd && onAllStoriesEnd();
            setIsStoryOpen(false);
        }
    };

    const onPrevUser = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setCurrentStory(stories[currentIndex - 1]?.content.length - 1 || 0);
        }
    };

    const renderContent = (story: StoryContent) => {
        if (story.type === 'image') {
            return <Image source={{ uri: story.url }} style={styles.content} />;
        }
        if (story.type === 'video') {
            return (
                <Video
                    source={{ uri: story.url }}
                    style={styles.content}
                    //   resizeMode="cover"
                    isLooping
                    shouldPlay
                />
            );
        }
    };

    const renderStoryCircle = ({ item, index }: { item: Story; index: number }) => (
        <TouchableOpacity
            style={styles.storyCircle}
            onPress={() => {
                setCurrentIndex(index);
                setCurrentStory(0);
                setIsStoryOpen(true);
            }}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.userName} numberOfLines={1}>
                {item.userName}
            </Text>
        </TouchableOpacity>
    );

    if (!isStoryOpen) {
        return (
            <FlatList
                data={stories}
                renderItem={renderStoryCircle}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                contentContainerStyle={styles.storyCircleContainer}
            />
        );
    }

    return (
        <Swiper
            loop={false}
            showsPagination={false}
            index={currentIndex}
            onIndexChanged={(index) => {
                setCurrentIndex(index);
                setCurrentStory(0);
            }}
        >
            {stories.map((user, userIndex) => (
                <View key={user.id} style={styles.container}>
                    {/* Header with user info */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setIsStoryOpen(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <Text style={styles.userName}>{user.userName}</Text>
                    </View>

                    {/* Story content */}
                    <TouchableWithoutFeedback onPress={onNextStory}>
                        <View style={styles.contentWrapper}>{renderContent(user.content[currentStory])}</View>
                    </TouchableWithoutFeedback>

                    {/* Progress indicators */}
                    <View style={styles.progressWrapper}>
                        {user.content.map((story, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.progressBar,
                                    {
                                        flex: index < currentStory ? 1 : index === currentStory ? 0.5 : 0,
                                        backgroundColor: index <= currentStory ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </View>
            ))}
        </Swiper>
    );
};

const styles = StyleSheet.create({
    storyCircleContainer: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
    },
    storyCircle: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#ff8501',
    },
    userName: {
        marginTop: 5,
        fontSize: 12,
        color: '#000',
        maxWidth: 70,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    closeButton: {
        color: '#fff',
        fontSize: 16,
        marginRight: 10,
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: width,
        height: height,
    },
    progressWrapper: {
        flexDirection: 'row',
        position: 'absolute',
        top: 60,
        left: 10,
        right: 10,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    progressBar: {
        height: '100%',
        marginHorizontal: 2,
        borderRadius: 2,
    },
});

export default Stories;
