'use client';
import { useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { Paper, Box, CircularProgress } from '@mui/material';
import { MessageBox } from "react-chat-elements";
import TopHeading from './TopHeading';
import MessageSendInput from './MessageSendInput';

// region MESSAGES CHAT
const MessagesChat = () => {
    const { mode } = useColorScheme();
    const themeClass = mode === 'dark' ? 'dark-theme' : 'light-theme';
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [messageList, setMessageList] = useState([
        {
            id: '1',
            title: "Burhan",
            type: "text",
            text: "Hi there !",
            date: new Date(),
            focus: false,
            titleColor: "#000",
            forwarded: false,
            replyButton: false,
            removeButton: false,
            retracted: false,
            notch: true,
            status: 'sent',
            position: 'left',
        },
        {
            id: 2,
            title: "Asad",
            type: "text",
            text: "Hi, how are you?",
            date: new Date(),
            focus: false,
            titleColor: "#000",
            forwarded: false,
            replyButton: false,
            removeButton: false,
            retracted: false,
            notch: true,
            status: 'read',
            position: 'right',
        },
        {
            id: 3,
            title: "Burhan",
            type: "text",
            text: "Hi there !",
            date: new Date(),
            focus: false,
            titleColor: "#000",
            forwarded: false,
            replyButton: false,
            removeButton: false,
            retracted: false,
            notch: true,
            status: 'received',
            position: 'left',
        },
        {
            id: 4,
            title: "Asad",
            type: "text",
            text: "Hi, how are you?",
            date: new Date(),
            focus: false,
            titleColor: "#000",
            forwarded: false,
            replyButton: false,
            removeButton: false,
            retracted: false,
            notch: true,
            status: 'waiting',
            position: 'right',
        }
    ]);
    const [userInput, setUserInput] = useState<string>('');


    // Function to refresh the chat list
    const refreshChatList = async () => {
        setIsRefreshing(true);
        // Simulate API call delay
        setTimeout(() => {
            // Add a new dummy chat item
            setMessageList((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    title: "Burhan",
                    type: "text",
                    text: "Hi, how are you?",
                    date: new Date(),
                    focus: false,
                    titleColor: "#000",
                    forwarded: false,
                    replyButton: false,
                    removeButton: false,
                    retracted: false,
                    notch: true,
                    status: 'sent',
                    position: 'left',
                },
            ]);
            setIsRefreshing(false);
        }, 1500);
    };


    const handleSendMessage = () => {
        if (userInput?.trim() !== '') {
            setMessageList((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    title: "Asad",
                    type: "text",
                    text: `${userInput}`,
                    date: new Date(),
                    focus: false,
                    titleColor: "#000",
                    forwarded: false,
                    replyButton: false,
                    removeButton: false,
                    retracted: false,
                    notch: true,
                    status: 'waiting',
                    position: 'right',
                },
            ]);
            setUserInput('');
        } else {
            alert('Please enter a message to send.');
        }
    };

    // region Main UI
    return (
        <Paper
            elevation={3}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Top section */}
            <TopHeading />

            {/* Messages section */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    height: 'calc(100vh - 145px)', // Adjust height to leave space for header
                    padding: '16px',
                    background: themeClass === 'dark-theme' ? '#1a1a1a' : '#f5f5f5',
                }}
            >

                {/* Render messages */}
                {
                    messageList.map((message: any) => (
                        <MessageBox
                            key={message.id}
                            id={message.id}
                            position={message.position}
                            title={message.title}
                            type={message.type}
                            text={message.text}
                            date={message.date}
                            focus={message.focus}
                            titleColor={message.titleColor}
                            forwarded={message.forwarded}
                            replyButton={message.replyButton}
                            removeButton={message.removeButton}
                            retracted={message.retracted}
                            notch={message.notch}
                            status={message?.status}
                            className={themeClass === 'dark-theme' ? 'message-box-dark' : 'message-box-light'}
                        />
                    ))
                }

                {/* Demo Message Design */}
                {/* <MessageBox
                    id={1}
                    position="right"
                    title="Asad"
                    type="text"
                    text="Hi there !"
                    date={new Date()}
                    focus={false}
                    titleColor="#000"
                    forwarded={false}
                    replyButton={false}
                    removeButton={false}
                    retracted={false}
                    notch={true}
                    status='read'
                    className={themeClass === 'dark-theme' ? 'message-box-dark' : 'message-box-light'}
                /> */}
                {/* More messages as needed */}

                {/* Show loader while refreshing */}
                {isRefreshing && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
            </Box>

            {/* Input section */}
            <MessageSendInput
                value={userInput}
                handleInput={(event: Event): void => {
                    setUserInput((event.target as HTMLInputElement).value);
                }}
                handleSendMessage={handleSendMessage}
                refreshChatList={refreshChatList}
                isRefreshing={isRefreshing}
            />
        </Paper>
    )
}

export default MessagesChat;
