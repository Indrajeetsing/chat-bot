import React, { Component } from 'react';
import MessageTemplate from './MessageTemplate';

class Messages extends Component{
    constructor(){
        super();
    }

    render(){
        const messageTemplates = this.props.messages.map((message,index) => {
            return (
                <MessageTemplate key={index} message={message} />
            )
        })
        return (
            messageTemplates
        );
    }
}

export default Messages;
