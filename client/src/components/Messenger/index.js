import React, { useState, useEffect, useRef } from 'react';
import Conversation from './Conversation';
import Message from './Message';
// import ChatOnline from './ChatOnline';
import "../../css/messenger/messenger.css";
import { connect } from 'react-redux';
// import {} from '../../redux/actions/';
import { io } from 'socket.io-client';

import axios from 'axios';


/**
 * ----- Main Messenger Root Index Component ----
 * @param props
 * @returns {JSX.Element}
 * @constructor 
 */
const Messenger = (props) => {
    const [conversations, setConversations] = useState([]);
    const [currentUser, setCurrentUser] = useState(props.User.login ?? {});
    const [currentChat, setCurrentChat] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const scrollRef = useRef();
    // Implement Socket.
    const socket = useRef();

    /**
     * ---- useEffect HOOK ----
     * Make Socket Connection with first load.
     */
    useEffect(() => {
        console.log('1st Effect');
        if (props.User) {
            if (props.User.login) {
                setCurrentUser(props.User.login);
                getConversations(props.User.login);
            }
        }

        // Linking Socket Client To Server..
        socket.current = io("ws://localhost:8900");

        // make cleanup..
        return () => {
            setCurrentUser({});
            setConversations([]);
        };
    }, []);


    useEffect(() => {
        console.log('SOCKET ==== STARTING');

        // socket.current.on("demo-message", data => {
        //     console.log('The Data from demo == ', data);
        // })

        socket.current.on("getMessage", data => {

            console.log('Message from Socket -- ', data);

            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                creatadAt: Date.now()
            });
        });
    }, [socket]);


    /**
     * ---- useEffect HOOK ----
     * Setting the ArrivalMessage with currentChat's members including.
     */
    useEffect(() => {
        console.log('---- arrivalMessage changes Effect Hook ----');
        console.log('ARRIVAL MESSAGE -- ', arrivalMessage);
        console.log('CURRENT CHAT -- ', currentChat);

        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages([...messages, arrivalMessage]);
    }, [arrivalMessage, currentChat]);


    /**
     * ---- useEffect HOOK ----
     * To Send users to Socket.IO for online user socket have to receive.
     */
    useEffect(() => {
        if (currentUser.id) {
            // console.log('CURRENT USER -- ', currentUser);

            socket.current.emit("addUser", currentUser.id);
            socket.current.on("getUsers", users => {
                // Setting the OnlineUsers.
                // And get users from followings of currentUser.
                // console.log('ONLINE USERS -- ', currentUser.followings.filter(F => users.some(U => U?.userId === F)));
                setOnlineUsers(
                    currentUser.followings.filter(F => users.some(U => U?.userId === F))
                );
            });
        }
    }, [currentUser]);

    /**
     * ---- useEffect HOOK ----
     * To getting messages with current chat's ID.
     */
    useEffect(() => {
        if (currentUser.id) {
            getMessages(currentChat._id);
            // console.log('Current Chat == ', currentChat._id);
        }

        // make cleanup..
        return () => {
            setMessages([]);
        };
    }, [currentChat]);

    /**
     * ---- useEffect HOOK ----
     * To control useRef Hook for last conversations text showing.
     * It should be scrolled to last message which I was sent.
     */
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    /**
     * ---- To Getting The Conversations ----
     * @param loginUser
     * @returns {Promise<void>}
     */
    const getConversations = async (loginUser) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/conversation/${loginUser.id}`);
            setConversations(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    /**
     * ---- To Getting Messages ----
     * @param id
     * @returns {Promise<void>}
     */
    const getMessages = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/message/${id}`);
            // console.log('The RESPONSE -- ', response);
            setMessages(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    /**
     * ---- To Handle Submit Buttons Functionalities ----
     * @param event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (currentUser.id) {
            const message = {
                sender: currentUser.id,
                text: newMessage,
                conversationId: currentChat._id
            };

            const receiverId = currentChat.members.find(member => member !== currentUser.id);

            // See Receiver and Sender ID.
            console.log('ReceiverId & SenderId', receiverId, currentUser.id);
            // Message which want to send.
            // console.log('MESSAGE == ', newMessage);

            // sending message to socket.
            socket.current.emit("sendMessage", {
                senderId: currentUser.id,
                receiverId,
                text: newMessage
            });


            try {
                const response = await axios.post("http://localhost:8080/api/message_create", message);
                setMessages([...messages, response.data]);
                setNewMessage("");

            } catch (error) {
                console.log(error);
            }
        }
    };


    /**
     * ---- Rendering Function for UI ----
     * ---- Conversations Rendering ----
     * @param conversations
     * @returns {JSX.Element|*}
     */
    const renderConversations = (conversations) => {
        if (!conversations.length) {
            return (
                <div>
                    <h3>Loading..</h3>
                </div>
            );
        } else {
            return conversations.map((conv) => {
                return (
                    <div key={conv._id} onClick={() => setCurrentChat(conv)}>
                        <Conversation
                            conversation={conv}
                            currentUser={currentUser}
                        />
                    </div>
                );
            });
        }
    };

    /**
     * ---- Rendering Function for UI ----
     * ---- Chats Messages Rendering -----
     * @param messages
     * @returns {JSX.Element|*}
     */
    const renderMessage = (messages) => {
        if (messages.length < 1) {
            return <span>Loading...</span>;
        } else {
            return messages.map(message => (
                <div key={message._id} ref={scrollRef}>
                    <Message
                        message={message}
                        own={message.sender === currentUser.id}
                    />
                </div>
            ));
        }
    };

    /**
     * ---- Rendering Function for UI ----
     * ---- Current Chat Rendering ----
     * @param currentChat
     * @returns {JSX.Element}
     */
    const renderCurrentChat = (currentChat) => {
        if (currentChat.length < 1) {
            return (
                <div>
                    <h3 className="noConversationText">Open conversation to start a chat.</h3>
                </div>
            );
        } else {
            return (
                <>
                    {/*---- Top ChatBox ----*/}
                    <div className="chatBoxTop">
                        {renderMessage(messages)}
                    </div>

                    {/*---- Bottom ChatBox ----*/}
                    <div className="chatBoxBottom">
                        <textarea
                            className="chatMessageInput"
                            placeholder="Write your message.."
                            onChange={event => setNewMessage(event.target.value)}
                            value={newMessage}
                        >
                        </textarea>
                        <button
                            className="chatSubmitButton"
                            onClick={handleSubmit}
                        >
                            Send
                        </button>
                    </div>
                </>
            );
        }
    };


    /**
     * ---- Console ----
     */
    // console.log('Conversations -- ', conversations);
    // console.log('current Chat -- ', currentChat);
    // console.log('currrent User -- ', currentUser);
    // console.log('Messages -- ', messages);
    // console.log('Arrival Message -- ', arrivalMessage);

    // Return Statement..
    return (
        <div className="messenger">
            {/*----- Chat Menu ----*/}
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input type="text" placeholder="Search for friends" className="chatMenuInput" />
                    {renderConversations(conversations)}
                </div>
            </div>

            {/*---- Chat Box ----*/}
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {renderCurrentChat(currentChat)}
                </div>
            </div>

            {/*---- Chat Online ----*/}
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    {/* <ChatOnline
                        onlineUsers={onlineUsers}
                        currentUserId={currentUser?.id}
                        setCurrentChat={setCurrentChat}
                    /> */}
                </div>
            </div>
        </div>
    );
};

/**
 * ---- Map The Redux Stores Data Into Components Props ----
 * @param state
 * @returns {{User}}
 */
const mapStateToProps = (state) => {
    return {
        User: state.User
    };
};

export default connect(mapStateToProps, null)(Messenger);
