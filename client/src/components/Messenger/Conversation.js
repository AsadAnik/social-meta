import React, { useState, useEffect } from 'react';
import "../../css/messenger/conversation.css";
import { Avatar } from '@mui/material';
import { connect } from 'react-redux';
import { userInfoById } from '../../redux/actions/UserActions';

const Conversation = ({ conversation, currentUser, ...props }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // finding the others conversations besides currentUser..
        const friendId = conversation.members.find(member => member !== currentUser.id);

        // IIFE..
        (async () => {
            try {
                const response = await props.dispatch(userInfoById(friendId));
                const { payload } = response;
                if (payload.isUserFound){
                    const { userById } = response.payload;
                    setUser(userById);
                }

            } catch(error) {
                console.log(error);
            }
        })();

        // Cleanup return function..
        return () => {
            setUser(null);
        };
    }, [currentUser, conversation]);

    const renderUser = (USER) => {
        if (!USER){
            return (
                <div>Loading...</div>
            );
        }else{
            return (
                <div className="conversation">
                    <Avatar
                        className="conversationImg"
                        src={USER.profilePhoto ? `/profileUpload/${USER.profilePhoto}` : 'avatar'}
                        alt={USER.firstname}
                    />
                    <span className="conversationName">
                        {`${USER.firstname} ${USER.lastname}`}
                    </span>
                </div>
            );
        }
    }

    // Returning statement..
    return renderUser(user);
};

// MapStateToProps..
const mapStateToProps = (state) => {
    return {
        User: state.User
    }
};

export default connect(mapStateToProps, null)(Conversation);
