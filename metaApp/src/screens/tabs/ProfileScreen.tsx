import React, { useState, useRef } from 'react';
import {
  ScrollView,
  FlatList,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  useWindowDimensions,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import ProfileHeaderUI from '../../components/ui/ProfileHeaderUI';
import PostCard from '../../components/ui/PostCard';
import FollowersTab from '../../components/widgets/FollowersTab';
import FollowingTab from '../../components/widgets/FollowingTab';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';

const Tab = createMaterialTopTabNavigator();

// Mock user data for menu
const userData = {
  name: 'Asad Anik',
  username: '@asadanik',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop',
};

const postData = [
  {
    id: '1',
    userName: 'Asad Anik',
    postTime: '2 hours ago',
    post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
    liked: true,
    likes: 77,
    comments: 5,
  },
  {
    id: '2',
    userName: 'Asad Anik',
    postTime: '4 hours ago',
    post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
    liked: false,
    likes: 77,
    comments: 5,
  },
  {
    id: '3',
    userName: 'Asad Anik',
    postTime: '1 day ago',
    post: 'Hey, how are you there is no interaction with my own application here. And BTW this is my first day at office life here. Dude say me nice day to wishing me at a time bla bla ..',
    liked: false,
    likes: 1,
    comments: 0,
  },
];

// Image Picker Options Modal
const ImagePickerModal = ({ visible, onClose, onImageSelected, title }: any) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const openCamera = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        onImageSelected(response.assets[0].uri);
        onClose();
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        onImageSelected(response.assets[0].uri);
        onClose();
      }
    });
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.imagePickerOverlay}>
        <TouchableOpacity 
          style={styles.imagePickerBackground} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.imagePickerContainer, 
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.imagePickerHeader}>
            <Text style={styles.imagePickerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.imagePickerOptions}>
            <TouchableOpacity style={styles.imagePickerOption} onPress={openCamera}>
              <Icon name="camera-alt" size={30} color="#1DA1F2" />
              <Text style={styles.imagePickerOptionText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imagePickerOption} onPress={openGallery}>
              <Icon name="photo-library" size={30} color="#1DA1F2" />
              <Text style={styles.imagePickerOptionText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imagePickerOption} onPress={onClose}>
              <Icon name="cancel" size={30} color="#E53935" />
              <Text style={[styles.imagePickerOptionText, { color: '#E53935' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Enhanced Profile Header with Image Upload
const EnhancedProfileHeader = ({ 
  onMenuOpen, 
  profileImage, 
  coverImage, 
  onProfileImagePress, 
  onCoverImagePress,
  ...props 
}: any) => (
  <View style={styles.headerWrapper}>
    {/* Cover Image Section */}
    <View style={styles.coverImageContainer}>
      <Image 
        source={{ uri: coverImage || userData.coverImage }} 
        style={styles.coverImage} 
      />
      <TouchableOpacity 
        style={styles.editCoverButton} 
        onPress={onCoverImagePress}
      >
        <Icon name="camera-alt" size={20} color="#fff" />
      </TouchableOpacity>
    </View>

    {/* Profile Image Section */}
    <View style={styles.profileImageSection}>
      <TouchableOpacity 
        style={styles.profileImageContainer}
        onPress={onProfileImagePress}
      >
        <Image 
          source={{ uri: profileImage || userData.avatar }} 
          style={styles.profileImage} 
        />
        <View style={styles.editProfileImageButton}>
          <Icon name="camera-alt" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>

    {/* Original ProfileHeaderUI */}
    <View style={styles.originalHeaderContainer}>
      <ProfileHeaderUI {...props} type="OWN" />
    </View>

    {/* Menu Button */}
    <TouchableOpacity style={styles.menuButton} onPress={onMenuOpen}>
      <Icon name="menu" size={24} color="#000" />
    </TouchableOpacity>
  </View>
);

// Profile Menu Component
const ProfileMenu = ({ visible, onClose, onLogout, navigation }: any) => {
  const slideAnim = useRef(new Animated.Value(-300)).current;
  
  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const menuItems = [
    { icon: 'settings', label: 'Settings', onPress: () => console.log('Settings pressed') },
    { icon: 'bookmark', label: 'Saved', onPress: () => console.log('Saved pressed') },
    { icon: 'history', label: 'Activity', onPress: () => console.log('Activity pressed') },
    { icon: 'qr-code', label: 'QR Code', onPress: () => console.log('QR Code pressed') },
    { icon: 'person-add', label: 'Invite Friends', onPress: () => console.log('Invite pressed') },
    { icon: 'help', label: 'Help', onPress: () => console.log('Help pressed') },
    { icon: 'logout', label: 'Logout', onPress: onLogout, color: '#E53935' },
  ];

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.menuContainer, 
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.menuHeader}>
            <Image source={{ uri: userData.avatar }} style={styles.menuAvatar} />
            <View style={styles.menuUserInfo}>
              <Text style={styles.menuName}>{userData.name}</Text>
              <Text style={styles.menuUsername}>{userData.username}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuDivider} />
          
          <ScrollView style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
              >
                <Icon 
                  name={item.icon} 
                  size={24} 
                  color={item.color || '#333'} 
                  style={styles.menuIcon} 
                />
                <Text style={[styles.menuItemText, item.color && { color: item.color }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.menuFooter}>
            <Text style={styles.menuFooterText}>App Version 1.0.0</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Logout Confirmation Modal
const LogoutConfirmationModal = ({ visible, onClose, onConfirm }: any) => (
  <Modal
    transparent={true}
    visible={visible}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.logoutModalOverlay}>
      <View style={styles.logoutModalContainer}>
        <View style={styles.logoutModalHeader}>
          <Text style={styles.logoutModalTitle}>Logout</Text>
        </View>
        
        <View style={styles.logoutModalBody}>
          <Text style={styles.logoutModalText}>
            Are you sure you want to logout?
          </Text>
        </View>
        
        <View style={styles.logoutModalFooter}>
          <TouchableOpacity 
            style={[styles.logoutModalButton, styles.logoutModalCancelButton]} 
            onPress={onClose}
          >
            <Text style={styles.logoutModalCancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.logoutModalButton, styles.logoutModalConfirmButton]} 
            onPress={onConfirm}
          >
            <Text style={styles.logoutModalConfirmText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// Posts Tab Component
const PostsRoute = () => (
  <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
    <Text style={styles.heading}>Posts</Text>
    {postData.map(item => (
      <PostCard key={item.id} item={item} />
    ))}
  </ScrollView>
);

// Following Tab Component
const FollowingRoute = () => (
  <View style={styles.tabContent}>
    <FollowingTab />
  </View>
);

// Followers Tab Component
const FollowersRoute = () => (
  <View style={styles.tabContent}>
    <FollowersTab />
  </View>
);

const ProfileTabScreen = (props: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [imagePickerTitle, setImagePickerTitle] = useState('');
  const [imagePickerType, setImagePickerType] = useState<'profile' | 'cover'>('profile');
  const [profileImage, setProfileImage] = useState(userData.avatar);
  const [coverImage, setCoverImage] = useState(userData.coverImage);

  // Handle Pull-to-Refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleMenuOpen = () => {
    setMenuVisible(true);
  };

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  const handleLogoutConfirm = () => {
    console.log('User logged out');
    setLogoutModalVisible(false);
    Alert.alert('Success', 'You have been logged out successfully');
  };

  const handleProfileImagePress = () => {
    setImagePickerType('profile');
    setImagePickerTitle('Update Profile Picture');
    setImagePickerVisible(true);
  };

  const handleCoverImagePress = () => {
    setImagePickerType('cover');
    setImagePickerTitle('Update Cover Photo');
    setImagePickerVisible(true);
  };

  const handleImageSelected = (imageUri: string) => {
    if (imagePickerType === 'profile') {
      setProfileImage(imageUri);
      // Here you would typically upload the image to your server
      console.log('Profile image updated:', imageUri);
    } else {
      setCoverImage(imageUri);
      // Here you would typically upload the image to your server
      console.log('Cover image updated:', imageUri);
    }
  };

  const handleImagePickerClose = () => {
    setImagePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <EnhancedProfileHeader 
          {...props} 
          onMenuOpen={handleMenuOpen}
          profileImage={profileImage}
          coverImage={coverImage}
          onProfileImagePress={handleProfileImagePress}
          onCoverImagePress={handleCoverImagePress}
        />
        <View style={styles.tabContainer}>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: styles.tabBar,
              tabBarIndicatorStyle: styles.tabIndicator,
              tabBarLabelStyle: styles.tabLabel,
            }}
          >
            <Tab.Screen name="Posts" component={PostsRoute} />
            <Tab.Screen name="Following" component={FollowingRoute} />
            <Tab.Screen name="Followers" component={FollowersRoute} />
          </Tab.Navigator>
        </View>
      </ScrollView>

      {/* Profile Menu */}
      <ProfileMenu 
        visible={menuVisible} 
        onClose={handleMenuClose} 
        onLogout={handleLogoutPress}
        navigation={props.navigation}
      />
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal 
        visible={logoutModalVisible}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={imagePickerVisible}
        onClose={handleImagePickerClose}
        onImageSelected={handleImageSelected}
        title={imagePickerTitle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerWrapper: {
    position: 'relative',
  },
  
  // Cover Image Styles
  coverImageContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  editCoverButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 10,
  },

  // Profile Image Styles
  profileImageSection: {
    position: 'absolute',
    top: 140,
    left: 20,
    zIndex: 10,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1DA1F2',
    borderRadius: 15,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },

  originalHeaderContainer: {
    marginTop: 80,
    paddingTop: 20,
  },

  menuButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 5,
  },

  tabContainer: {
    height: 600,
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  tabIndicator: {
    backgroundColor: '#000',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#000',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  // Image Picker Modal Styles
  imagePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  imagePickerBackground: {
    flex: 1,
  },
  imagePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  imagePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  imagePickerOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 30,
  },
  imagePickerOption: {
    alignItems: 'center',
    padding: 20,
  },
  imagePickerOptionText: {
    fontSize: 16,
    color: '#1DA1F2',
    marginTop: 10,
    fontWeight: '500',
  },

  // Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
    position:'relative',
    top: 70
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    width: 280,
    backgroundColor: '#fff',
    height: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  menuAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  menuUserInfo: {
    flex: 1,
    marginLeft: 15,
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  menuUsername: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 5,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  menuFooterText: {
    fontSize: 12,
    color: '#999',
  },

  // Logout Modal Styles
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  logoutModalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoutModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  logoutModalBody: {
    padding: 20,
  },
  logoutModalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  logoutModalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutModalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  logoutModalCancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  logoutModalConfirmButton: {
    backgroundColor: '#fff',
  },
  logoutModalCancelText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  logoutModalConfirmText: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: '600',
  },
});

export default ProfileTabScreen;