import React, { Component } from 'react';
import { socketEmit, socketOn } from './SocketEvents';
import apiBaseUrl from './Config';
import Messages from './Messages';
import axios from 'axios';

class CustomerHome extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
    }

       socketOn.chatMessage((data) => {
           if(data.roomName === this.props.userName){
               const newMessages = this.state.messages.slice();
               newMessages.push(data.message);
               this.setState({messages: newMessages});
           }
       });

       this.sendMessage = (event) => {
           event.preventDefault();
           const userMessage = this.props.userName + ' : ' + event.target.elements.message.value.trim();
           const header = this.props.auth_token;
           axios.get(apiBaseUrl + 'verify', {headers: {'x-access-token': header}})
               .then((res) => {
                   socketEmit.chatMessage({ roomName:this.props.userName, message: userMessage}, (err) => {});
               })
               .catch((err) => {
               }
           )
           event.target.elements.message.value = '';
       };

      this.logout = () => {
         window.location.reload();
      }

  }

  render() {

    return (
      <div className="App full-height">
        <div className="navbar">
          <div className="flex-1">
          </div>
          <div className="flex-1">
              <div className="center">
                <h1>{this.props.userName} Home</h1>
              </div>
          </div>
          <div className="flex-1">
            <div  className="float-right logout-button">
              <button className="pointer" onClick={this.logout}>Logout</button>
            </div>
          </div>
        </div>
        <div className="full-height">
          <Messages messages={this.state.messages} />
          <form onSubmit={(event) => this.sendMessage(event)}>
            <input className="width-88" id="m" name="message" autoComplete="off"/>
            <button className="pointer" type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  }
}


export default CustomerHome;
