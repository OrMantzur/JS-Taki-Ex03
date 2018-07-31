import React from 'react';

const CHAT_TIMEOUT_INTERVAL = 0.2 * 1000;

export default class conversationArea extends React.Component {

    constructor(args) {
        super(...args);

        this.state = {
            content: []
        };

        this.getChatContent = this.getChatContent.bind(this);
    }

    componentDidMount() {
        this.getChatContent();
    }

    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    render() {
        return (
            <div className="conversation-area-wrapper">
                {this.state.content.map((line) => (
                    <p key={line.user.name + line.timeStamp}><b>{line.user}:</b> {line.text}</p>))}
            </div>
        )
    }

    getChatContent() {
        return fetch('/chat', {method: 'GET', credentials: 'include'})
            .then((response) => {
                if (!response.ok) {
                    throw response;
                }
                this.timeoutId = setTimeout(this.getChatContent, CHAT_TIMEOUT_INTERVAL);
                return response.json();
            })
            .then(content => {
                this.setState(() => ({content}));
            })
            .catch(err => {
                throw err
            });
    }

}