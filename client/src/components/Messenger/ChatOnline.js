import React from 'react';
import "../../css/messenger/chatOnline.css";

const ChatOnline = () => {
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                {/*---- Online Chat Avatar and Badge -----*/}
                <div className="chatOnlineImgContainer">
                    <img
                        className="chatOnlineImg"
                        src="https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/163254260/original/5a3f539f2ccafcc8b21870bab5ac69a5fc31259b/draw-a-personalized-pixel-art-avatar-of-you-in-my-style.png"
                        alt=""
                    />
                    <div className="chatOnlineBadge"></div>
                </div>

                {/*----- Online User Name -----*/}
                <span className="chatOnlineName">John Doe</span>
            </div>
        </div>
    );
};

export default ChatOnline;