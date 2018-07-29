import React from 'react';
import ConversationArea from './converssionArea.jsx';
import ChatInput from './chatInput.jsx';

export default function () {

    return (
        <div className="chat-contaier">
            <ConversationArea/>
            <ChatInput/>
        </div>
    )

}