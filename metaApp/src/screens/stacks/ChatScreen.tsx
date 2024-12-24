import React, { useRef, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  Alert,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../styles/MessageStyle';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

// import ChatTabScreen from './ChatScreen';

type Message = {
  id: string;
  userName: string;
  userImg: any;
  messageTime: string;
  messageText: string;
};

const Messages: Message[] = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../../assets/images/asadanik.jpg'),
    messageTime: '4 mins ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../../assets/images/asadanik.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../../assets/images/asadanik.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../../assets/images/asadanik.jpg'),
    messageTime: '1 day ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../../assets/images/asadanik.jpg'),
    messageTime: '2 days ago',
    messageText:
      'Hey there, this is my test for a post of my social app in React Native.',
  },
];

type MessagesScreenProps = {
  navigation: any; // Replace `any` with the correct type if you're using a type-safe navigation library like React Navigation
};

const ChatTabScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <>
      <Container>
        <FlatList
          refreshControl={<RefreshControl refreshing={false} />}
          data={Messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card
              onPress={() =>
                navigation.navigate('Messages', { userName: item.userName })
              }
              onLongPress={handlePresentModalPress}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={item.userImg} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.messageTime}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.messageText}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      </Container>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          snapPoints={['25%', '50%']} // Adjust the height of the bottom sheet as needed
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text style={styles.modalTitle}>Actions</Text>

            <TouchableOpacity
              style={styles.optionWrapperContainer}
              onPress={() => {
                Alert.alert(
                  'Block User',
                  'Are you sure you want to block this user?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Block', style: 'destructive', onPress: () => console.log('User Blocked') },
                  ]
                );
                bottomSheetModalRef.current?.dismiss();
              }}
            >
              <View>
                <EntypoIcon name="block" size={24} color="#000" />
              </View>

              <View>
                <Text>Block User</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionWrapperContainer}
              onPress={() => {
                Alert.alert(
                  'Delete Chat',
                  'Are you sure you want to delete this chat?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => console.log('Chat Deleted') },
                  ]
                );
                bottomSheetModalRef.current?.dismiss();
              }}
            >
              <View>
                <AntDesign name="delete" size={24} color="#000" />
              </View>

              <View>
                <Text>Delete User</Text>
              </View>
            </TouchableOpacity>

            {/* Close Option */}
            <Button
              title="Close"
              onPress={() => bottomSheetModalRef.current?.dismiss()}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  optionWrapperContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    width: '100%',
  }
});

export default ChatTabScreen;
