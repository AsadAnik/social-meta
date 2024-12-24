import React, { useRef, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message {
  id: string;
  text: string;
  user: 'me' | 'bot';
}

const MessagesScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?', user: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const flatListRef = useRef<FlatList<Message>>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const userName = route?.params?.userName || 'John Doe';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chat with ' + userName,
    });
  }, [navigation, userName]);

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      user: 'me',
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          text: "I'm a bot! Let me know if you need assistance.",
          user: 'bot',
        },
      ]);
    }, 1000);
  };

  const handleEdit = () => {
    if (!selectedMessage) return;
    setInput(selectedMessage.text);
    setMessages((messages) =>
      messages.filter((msg) => msg.id !== selectedMessage.id)
    );
    bottomSheetModalRef.current?.dismiss();
  };

  const handleDelete = () => {
    if (!selectedMessage) return;
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMessages((messages) =>
              messages.filter((msg) => msg.id !== selectedMessage.id)
            );
            bottomSheetModalRef.current?.dismiss();
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.user === 'me';
    return (
      <TouchableOpacity
        onLongPress={() => {
          setSelectedMessage(item);
          bottomSheetModalRef.current?.present();
        }}
      >
        <View
          style={[
            styles.messageContainer,
            isUser ? styles.userMessage : styles.botMessage,
          ]}
        >
          <Text style={isUser ? styles.userText : styles.botText}>
            {item.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetModalProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          extraData={messages}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet Modal */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['25%']}
        >
          <BottomSheetView style={styles.bottomSheetContent}>
            <View style={styles.optionContainer}>
              <TouchableOpacity
                onPress={handleEdit}
             
              >
                <Icon name="edit" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.optionText}>Edit</Text>
            </View>
            <View style={styles.optionContainer}>
              <TouchableOpacity
                onPress={handleDelete}
                // style={{ backgroundColor: '#000' }}
              >
                <Icon name="delete" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.optionText}>Delete</Text>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
};

export default MessagesScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  chatContainer: {
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0078fe',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1e1e1',
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: Platform.OS === 'ios' ? 20 : 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0078fe',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
    width: '100%',
  },
  optionButton: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 8,
  },
  optionText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    width: '100%',
  },
});
