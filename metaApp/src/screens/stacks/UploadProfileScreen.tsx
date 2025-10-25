import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  Pressable,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Button } from '../../components/widgets/Button.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../lib/types/Button.type.ts';

interface UploadProfileProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UploadProfile'>;
}

interface DataState {
  profilePhoto: string | null;
  check_textInputChange: boolean;
  secureTextEntry: boolean;
  email?: string;
  password?: string;
  isLoading: boolean;
}

const { width } = Dimensions.get('window');

// region Main Component
const UploadProfile: React.FC<UploadProfileProps> = ({ navigation }) => {
  console.log('navigation data ', navigation, '');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [data, _setData] = useState<DataState>({
    profilePhoto: null,
    check_textInputChange: false,
    secureTextEntry: true,
    isLoading: false,
  });

  const handleBottomSheetOpen = useCallback(() => {
    setIsBottomSheetOpen(true);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/images/post1.jpg')}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.textHeader}>Upload Profile Photo</Text>
      </View>

      {/* Footer Section */}
      <Animatable.View
        style={[styles.footer, isBottomSheetOpen && { opacity: 0.3 }]}
        animation="fadeInUpBig"
        duration={800}
      >
        <Pressable onPress={handleBottomSheetOpen}>
          <Image
            source={
              data.profilePhoto
                ? { uri: data.profilePhoto }
                : require('../../assets/images/avatar-male.png')
            }
            style={styles.profileImage}
          />
        </Pressable>

        <View style={styles.continueButton}>
          <Button
            title="Continue"
            size={18}
            textColor="white"
            width={width * 0.6}
            height={50}
            onPress={() => navigation.navigate('MainTabs')}
          />
        </View>
      </Animatable.View>

      {/* Bottom Sheet Area (custom simplified version) */}
      {isBottomSheetOpen && (
        <Animatable.View
          animation="slideInUp"
          duration={500}
          style={styles.bottomSheet}
        >
          <Text style={styles.sheetTitle}>Choose an option</Text>
          <View style={styles.sheetButtons}>
            <Button
              title="Take Photo"
              size={16}
              height={45}
              width={110}
              textColor="black"
              onPress={() => console.log('Take Photo')}
            />
            <Button
              title="Upload"
              size={16}
              height={45}
              width={110}
              textColor="white"
              onPress={() => console.log('Upload')}
            />
            <Button
              title="Cancel"
              size={16}
              height={45}
              width={110}
              textColor="white"
              onPress={handleBottomSheetClose}
            />
          </View>
        </Animatable.View>
      )}
    </ImageBackground>
  );
};

// region Style Sheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  textHeader: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 26,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  profileImage: {
    height: 160,
    width: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  continueButton: {
    marginTop: 40,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sheetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default UploadProfile;
