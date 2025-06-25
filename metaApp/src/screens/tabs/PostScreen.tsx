import React, { useState } from 'react';
import { Alert, Keyboard, Platform } from 'react-native';
import { PostContainer } from '../../styles/AddPostStyles';
import { useCreatePostMutation, useGetAllPostsQuery } from '../../redux/slice/post.slice';
import { launchImageLibrary } from 'react-native-image-picker';
import { FloatingAction, PostPlayground } from '../../components/ui/CreatePost';
import { useAndroidFormDataPost } from '../../hooks';
import { ensureMediaPermission } from '../../lib/utils/permissionUtils';

// Define action types for better type safety
type ActionType = 'image' | 'video' | 'file';

interface PostProps {
  navigation?: any;
  onPostCreated?: () => void;
}

// region Utility function to format media object for FormData
const formatMediaForFormData = (media: any) => {
  if (!media) {
    return null;
  }

  const uri = media.uri || media.path;
  const type = media.type || media.mimeType || 'image/jpeg';
  const fileName = media.fileName || media.name || `media-${Date.now()}.${type.split('/')[1] || 'jpg'}`;

  return { uri, type, name: fileName };
};

// region Post Screen
const Post: React.FC<PostProps> = ({ navigation, onPostCreated }) => {
  const [postContent, setPostContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // RTK Query hook for creating posts
  const [createPost] = useCreatePostMutation();

  // Custom hook for Android FormData uploads
  const { postFormData: androidCreatePost } = useAndroidFormDataPost();

  // Fetch to update the Screen while creating post from Android devices.
  const { refetch } = useGetAllPostsQuery({ page: 1, limit: 5 });

  // reset the UI for android refetch thing
  const resetUI = () => {
    setPostContent('');
    setSelectedMedia(null);
    onPostCreated?.();
    navigation?.goBack();
    refetch(); // Refresh posts list
  };

  // Handle post submission
  // region Submit Post
  const handleSubmitPost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Please write something to post');
      return;
    }

    setIsSubmitting(true);
    Keyboard.dismiss();

    try {
      const formData = new FormData();
      formData.append('content', postContent.trim());

      if (selectedMedia) {
        const fileObject = formatMediaForFormData(selectedMedia);

        if (fileObject) {
          formData.append('file', fileObject as any);
        }
      }

      if (Platform.OS === 'android') {
        await androidCreatePost({ formData, onSuccess: () => resetUI() });

      } else {
        // Text-only post for iOS
        await createPost(formData).unwrap();
        resetUI();
      }

    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');

    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle media selection
  // region Handle Media
  const handleMediaSelection = async (type: ActionType) => {
    try {
      // Determine permission type based on action
      let permissionType: 'photo' | 'video' = 'photo';
      if (type === 'video') {
        permissionType = 'video';
      }

      // Check and request permission before accessing media
      const hasPermission = await ensureMediaPermission(
        permissionType,
        () => {
          // Permission granted - proceed with media selection
          proceedWithMediaSelection(type);
        },
        () => {
          // Permission denied - user cancelled or denied
          console.log('Permission denied for media access');
        }
      );

      // If permission is already granted, proceed immediately
      if (hasPermission) {
        proceedWithMediaSelection(type);
      }

    } catch (error) {
      console.error('Error in media selection:', error);
      Alert.alert('Error', 'Failed to access media. Please try again.');
    }
  };

  // Helper function to proceed with media selection after permission check
  // region Proceed With Media Selection
  const proceedWithMediaSelection = async (type: ActionType) => {
    try {
      if (type === 'image') {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          selectionLimit: 1,
          includeBase64: false,
        });

        if (result.assets && result.assets[0]) {
          setSelectedMedia(result.assets[0]);
        }

      } else if (type === 'video') {
        const result = await launchImageLibrary({
          mediaType: 'video',
          quality: 0.8,
          selectionLimit: 1,
          includeBase64: false,
        });

        if (result.assets && result.assets[0]) {
          setSelectedMedia(result.assets[0]);
        }

      } else if (type === 'file') {
        Alert.alert('Coming Soon', 'File upload will be available soon!');
      }

    } catch (error) {
      console.error('Error selecting media:', error);
      Alert.alert('Error', 'Failed to select media. Please try again.');
    }
  };

  // Handle floating action button press
  // region Handle Action
  const handleActionPress = (name?: string) => {
    if (!name) {
      return;
    }

    switch (name) {
      case 'bt_image':
        handleMediaSelection('image');
        break;

      case 'bt_video':
        handleMediaSelection('video');
        break;

      case 'bt_file':
        handleMediaSelection('file');
        break;

      default:
        console.log('Unknown action');
    }
  };

  // region UI
  return (
    <PostContainer>
      <PostPlayground
        textContent={postContent}
        onChangeTextContent={(text) => setPostContent(text)}
        handleSubmitPost={handleSubmitPost}
        isSubmitting={isSubmitting}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
      />

      <FloatingAction handleActionPress={handleActionPress} />
    </PostContainer>
  );
};

export default Post;
