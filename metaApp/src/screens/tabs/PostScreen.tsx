import React, { useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { PostContainer } from '../../styles/AddPostStyles';
import { useCreatePostMutation } from '../../redux/slice/post.slice';
import { launchImageLibrary } from 'react-native-image-picker';
import { FloatingAction, PostPlayground } from '../../components/ui/CreatePost';

// Define action types for better type safety
type ActionType = 'image' | 'video' | 'file';

interface PostProps {
  navigation?: any;
  onPostCreated?: () => void;
}

const Post: React.FC<PostProps> = ({ navigation, onPostCreated }) => {
  const [postContent, setPostContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // RTK Query hook for creating posts
  const [createPost] = useCreatePostMutation();

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
      // Create form data for media upload if needed
      const formData = new FormData();
      formData.append('content', postContent.trim());

      if (selectedMedia) {
        formData.append('media', {
          uri: selectedMedia.uri,
          type: selectedMedia.type,
          name: selectedMedia.fileName || `media-${Date.now()}.${selectedMedia.type.split('/')[1]}`,
        });
      }

      console.log('Selected Media - ', selectedMedia);
      console.log('Post Content - ', postContent);
      console.log('(FormData) Post Content - ', formData);

      await createPost(formData).unwrap();

      // Reset form
      setPostContent('');
      setSelectedMedia(null);

      // Notify parent component
      // Navigate back if navigation is provided
      onPostCreated?.();
      navigation?.goBack();

    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');

    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle media selection
  // region Select Media
  const handleMediaSelection = async (type: ActionType) => {
    try {
      if (type === 'image') {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
          selectionLimit: 1,
        });

        if (result.assets && result.assets[0]) {
          setSelectedMedia(result.assets[0]);
        }
      } else if (type === 'video') {
        const result = await launchImageLibrary({
          mediaType: 'video',
          quality: 0.8,
          selectionLimit: 1,
        });

        if (result.assets && result.assets[0]) {
          setSelectedMedia(result.assets[0]);
        }
      } else if (type === 'file') {
        // Implement document picker if needed
        Alert.alert('Coming Soon', 'File upload will be available soon!');
      }
    } catch (error) {
      console.error('Error selecting media:', error);
    }
  };

  // Handle floating action button press
  // region Press Action
  const handleActionPress = (name?: string) => {
    if (!name) return;

    switch (name) {
      case 'bt_image':
        console.log('Image action selected');
        break;

      case 'bt_video':
        console.log('Video action selected');
        break;

      case 'bt_file':
        console.log('File action selected');
        break;

      default:
        console.log('Unknown action');
    }
  };


  return (
    <PostContainer>
      {/* region PostPlayground */}
      <PostPlayground
        textContent={postContent}
        onChangeTextContent={(text) => setPostContent(text)}
        handleSubmitPost={handleSubmitPost}
        isSubmitting={isSubmitting}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
      />

      {/* region Floating Button */}
      <FloatingAction handleActionPress={handleActionPress} />
    </PostContainer>
  );
};

export default Post;
