import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { PostCard } from '../../components/widgets';
import { InstaStoryUI } from '../../components/widgets';
import { Container } from '../../styles/FeedStyles';
import {
  useGetAllPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} from '../../redux/slice/post.slice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../components/widgets/Button';

const LIMIT = 5;

// region Main Component
const HomeTabScreen = ({ navigation }: any) => {
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [currentPost, setCurrentPost] = useState<any>(null);
    const [actionMenuVisible, setActionMenuVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation for FAB
    const scrollY = useRef(new Animated.Value(0)).current;
    const fabAnimation = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    // API Hooks
    const { data, isLoading, isFetching, refetch } = useGetAllPostsQuery({ page, limit: LIMIT });
    const [createPost] = useCreatePostMutation();
    const [updatePost] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();

    // Extract posts safely, handle empty data
    useEffect(() => {
        if (data?.posts?.posts?.length > 0) {
            const transformedPosts = data.posts.posts.map(transformPost);

            // Ensure we don't have duplicate posts when adding new page data
            if (page === 1) {
                setPosts(transformedPosts);
            } else {
                // Filter out any posts that already exist in the current state
                const existingPostIds = new Set(posts.map(post => post._id));
                const newPosts = transformedPosts.filter((post: { _id: any; }) => !existingPostIds.has(post._id));
                setPosts(prev => [...prev, ...newPosts]);
            }
        } else if (page === 1) {
            setPosts([]);
        }
    }, [data, page]);

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await refetch();
        setRefreshing(false);
    };

    const transformPost = (post: any) => {
        if (!post.owner) {
            console.warn(`Post ${post._id} missing owner`);
        }
        const owner = post.owner || {};
        return {
            _id: post._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userName: `${owner.firstname || 'Unknown'} ${owner.lastname || ''}`.trim(),
            userImg: owner.profilePhoto ? { uri: owner.profilePhoto } : require('../../assets/images/avatar-male.png'),
            postTime: post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown date',
            post: post.content || '',
            image: post.image,
            liked: false,
            likes: post.likes_count || 0,
            comments: post.comments_count || 0,
            // Add raw data for editing
            rawData: post,
        };
    };

    // Detect scroll to bottom for pagination
    const handleScrollEnd = useCallback(({ nativeEvent }: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isBottomReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
        if (isBottomReached && !isFetching && !isLoading) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, isLoading]);

    // Track scroll position for FAB animation
    const handleScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: true }
    );

    // CRUD Operations
    const handleCreatePost = async () => {
        if (!postContent.trim()) {
            Alert.alert('Error', 'Post content cannot be empty');
            return;
        }

        try {
            setIsSubmitting(true);
            await createPost({ content: postContent }).unwrap();
            setPostContent('');
            setCreateModalVisible(false);
            setPage(1);
            refetch();
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdatePost = async () => {
        if (!postContent.trim() || !currentPost?._id) {
            Alert.alert('Error', 'Post content cannot be empty');
            return;
        }

        try {
            setIsSubmitting(true);
            await updatePost({
                id: currentPost._id,
                content: postContent,
            }).unwrap();
            setPostContent('');
            setEditModalVisible(false);
            setCurrentPost(null);
            setPage(1);
            refetch();

        } catch (error) {
            console.error('Failed to update post:', error);

        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePost(postId).unwrap();
                            setPosts(posts.filter(post => post._id !== postId));
                            setActionMenuVisible(false);
                            setSelectedPostId(null);
                        } catch (error) {
                            console.error('Failed to delete post:', error);
                            Alert.alert('Error', 'Failed to delete post. Please try again.');
                        }
                    },
                },
            ]
        );
    };

    const openEditModal = (post: any) => {
        setCurrentPost(post);
        setPostContent(post.post);
        setEditModalVisible(true);
        setActionMenuVisible(false);
    };

    const handlePostOptions = (postId: string) => {
        setSelectedPostId(postId);
        setActionMenuVisible(true);
    };

    // Helper function to render posts list with unique keys
    const renderPostData = (data: any[]) => {
        return data.map((post, index) => (
            <PostCard
                key={`post-${post._id}-${index}`}
                item={post}
                onOptionsPress={() => handlePostOptions(post._id)}
            />
        ));
    };

    // Find the selected post for action menu
    const selectedPost = posts.find(post => post._id === selectedPostId);

    // Navigate to Create Post
    const navigateToCreatePost = () => {
        navigation.navigate('Post');
    };

    // region UI
    return (
        <Container>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    // onMomentumScrollEnd={handleScrollEnd}
                    // onScroll={handleScroll}
                    // scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                >
                    <InstaStoryUI />

                    {posts.length === 0 && !isLoading && (
                        <>
                            <Text style={styles.noPostsText}>No Posts Found.</Text>
                            <View style={{ marginVertical: 10 }}>
                                <Button title="Create Post" onPress={navigateToCreatePost} />
                            </View>
                        </>
                    )}

                    {renderPostData(posts)}

                    {isFetching && page > 1 && (
                        <View style={styles.loadingMore}>
                            <ActivityIndicator size="small" color="#1DA1F2" />
                            <Text style={styles.loadingText}>Loading more...</Text>
                        </View>
                    )}
                </ScrollView>

                {/* Edit Post Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editModalVisible}
                    onRequestClose={() => setEditModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Post</Text>
                                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                    <Icon name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.postInput}
                                placeholder="Edit your post..."
                                multiline
                                value={postContent}
                                onChangeText={setPostContent}
                                autoFocus
                            />

                            <View style={styles.modalFooter}>
                                <TouchableOpacity
                                    style={[styles.postButton, !postContent.trim() && styles.disabledButton]}
                                    onPress={handleUpdatePost}
                                    disabled={!postContent.trim() || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.postButtonText}>Update</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Post Action Menu */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={actionMenuVisible}
                    onRequestClose={() => setActionMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.actionMenuOverlay}
                        activeOpacity={1}
                        onPress={() => setActionMenuVisible(false)}
                    >
                        <View style={styles.actionMenuContent}>
                            <TouchableOpacity
                                style={styles.actionMenuItem}
                                onPress={() => selectedPost && openEditModal(selectedPost)}
                            >
                                <Icon name="edit" size={20} color="#333" />
                                <Text style={styles.actionMenuItemText}>Edit Post</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionMenuItem, styles.deleteMenuItem]}
                                onPress={() => selectedPostId && handleDeletePost(selectedPostId)}
                            >
                                <Icon name="delete" size={20} color="#E53935" />
                                <Text style={[styles.actionMenuItemText, styles.deleteText]}>Delete Post</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </KeyboardAvoidingView>
        </Container>
    );
};

// region Style Sheet
const styles = StyleSheet.create({
    noPostsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    loadingMore: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
    fabContainer: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1DA1F2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    postInput: {
        minHeight: 120,
        fontSize: 16,
        paddingTop: 15,
        textAlignVertical: 'top',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    postButton: {
        backgroundColor: '#1DA1F2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 100,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#A8D5F7',
    },
    postButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    actionMenuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionMenuContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '80%',
        overflow: 'hidden',
    },
    actionMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    deleteMenuItem: {
        borderBottomWidth: 0,
    },
    actionMenuItemText: {
        fontSize: 16,
        marginLeft: 15,
        color: '#333',
    },
    deleteText: {
        color: '#E53935',
    },
});

export default HomeTabScreen;
