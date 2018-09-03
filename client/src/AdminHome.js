import React, { Component } from 'react';
import Global from './Global.css'
import axios from 'axios';
import apiBaseUrl from './Config';
import { socketEmit, socketOn } from './SocketEvents';
import Messages from './Messages';

class AdminHome extends Component {
  constructor(){
    super();
    this.state = {
      name: 'admin',
      chatRooms: [],
      messages: [],
      roomName: '',
      logout: false
    }

       socketOn.updateChatRoomsAdmin((data) => {
           this.setState({chatRooms: data});
       });

       socketOn.updateChatRooms((data) => {
           this.setState({chatRooms: data});
       });

       socketOn.updateUserMessages((data) => {
           this.setState({messages: data});
       });

       socketOn.chatMessage((data) => {
           if(data.roomName === this.state.roomName){
               const newMessages = this.state.messages.slice();
               newMessages.push(data.message);
               this.setState({messages: newMessages});
           }
       });

       this.userClicked = (event) => {
           const userName = event.target.innerText;
           this.setState({roomName: userName});
           socketEmit.getMessages(userName);
       }

       this.sendMessage = (event) => {
           event.preventDefault();
           const supportMessage = 'support : ' + event.target.elements.message.value.trim();
           const header = this.props.auth_token;
           axios.get(apiBaseUrl + 'verify', {headers: {'x-access-token': header}})
               .then((res) => {
                   socketEmit.chatMessage({roomName:this.state.roomName,message:supportMessage}, (err) => {
                   });
               })
               .catch((err) => {
               }
           )
           event.target.elements.message.value = '';
       }

     this.logout = () => {
        window.location.reload();
     }

  }

  render() {
    const userNames  = this.state.chatRooms.map((user) => {
            return (
      				<div className={ this.state.roomName === user.name ? 'selected pointer user-div' : 'none pointer user-div'}  key={user.name}>
      					{user.name}
      				</div>
    			);
        })

    return (
      <div className="App full-height">
        <div className="navbar">
          <div className="flex-1">
          </div>
          <div className="flex-1">
              <div className="center">
                <h1>Admin Home</h1>
              </div>
          </div>
          <div className="flex-1">
            <div  className="float-right logout-button">
              <button className="pointer" onClick={this.logout}>Logout</button>
            </div>
          </div>
        </div>
        <div className="flex full-height">
          <div className="sidebar">
            <div className="available-users"> Available Users </div>
            <div className="center users-div" onClick={(event) => this.userClicked(event)}>{userNames}</div>
          </div>
          <div className="main">
            <Messages messages={this.state.messages} />
            <form onSubmit={(event) => this.sendMessage(event)}>
              <input id="m" name="message"  autoComplete="off"/>
              <button className="pointer" type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminHome;
