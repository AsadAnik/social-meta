import { InputField, InputWrapper } from '../../../styles/AddPostStyles';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconButton } from '../../widgets/Button';
import React from 'react';

type PostPlaygroundProps = {
  selectedMedia: any;
  setSelectedMedia: (media: any) => void;
  handleSubmitPost: () => void;
  isSubmitting: boolean;
  textContent: string;
  onChangeTextContent: (text: string) => void;
  placeholerText?: string;
};

// region Main Component
const PostPlayground: React.FC<PostPlaygroundProps> = ({ selectedMedia, setSelectedMedia, handleSubmitPost, isSubmitting, textContent, onChangeTextContent, placeholerText = "What's on your mind?" }) => {
  return (
    <InputWrapper>
      {/* region Input Text Field */}
      <InputField
        placeholder={placeholerText}
        multiline
        numberOfLines={8}
        value={textContent}
        onChangeText={onChangeTextContent}
        editable={!isSubmitting}
      />

      {/* region Selected Media */}
      {selectedMedia && (
        <View style={styles.mediaPreviewContainer}>
          {selectedMedia.type.includes('image') ? (
            <View style={styles.imagePreview}>
              <Image
                source={{ uri: selectedMedia.uri }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeMediaButton}
                onPress={() => setSelectedMedia(null)}
              >
                <AntDesign name="closecircle" size={24} color="#FF3B30" />
              </TouchableOpacity>
              <View style={styles.mediaTypeIndicator}>
                <Entypo name="image" size={16} color="white" />
              </View>
            </View>
          ) : (
            <View style={styles.videoPreview}>
              <TouchableOpacity
                style={styles.removeMediaButton}
                onPress={() => setSelectedMedia(null)}
              >
                <AntDesign name="closecircle" size={24} color="#FF3B30" />
              </TouchableOpacity>
              <View style={styles.mediaTypeIndicator}>
                <MaterialIcons name="videocam" size={16} color="white" />
              </View>
            </View>
          )}
        </View>
      )}

      {/* region Submit Post Button */}
      <IconButton
        title="Create Post"
        onPress={handleSubmitPost}
        isLoading={isSubmitting}
        bgColor="#1DA1F2"
        iconName="send"
      />
    </InputWrapper>
  );
};

// region StyleSheet
const styles = StyleSheet.create({
  mediaPreviewContainer: {
    marginTop: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPreview: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  removeMediaButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  mediaTypeIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    padding: 4,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default PostPlayground;
