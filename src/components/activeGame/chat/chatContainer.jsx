/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import React from 'react';
import ConversationArea from './conversationArea.jsx';
import ChatInput from './chatInput.jsx';

export default function () {

    return (
        <div className="chat-container">
            <ConversationArea/>
            <ChatInput/>
        </div>
    )

}