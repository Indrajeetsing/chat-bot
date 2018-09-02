import React, { Component } from 'react';
import Global from './Global.css'
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import AdminLogin from './AdminLogin';

class AdminHome extends Component {
  constructor(){
    super();
    this.state = {
      users: [],
      messages: [],
      logout: false
    }

    const socket = socketIOClient('http://localhost:8000');

    this.getUsers =(event) => {
      var self = this;
    //   console.log(event.target.elements);
     var apiBaseUrl = "http://localhost:8000/";
     var users = [];
     axios.get(apiBaseUrl+'users')
     .then(function (response) {
     console.log(response);
     self.setState({users: response.data});
     console.log(users);

     })
     .catch(function (error) {
     console.log(error);
     });
     }

     this.logout = () => {
       this.setState({logout: true});
     }


var allmessages = this.state.messages;
this.sendMessage = (event) => {
  event.preventDefault();
  var self = this;
    // const socket = socketIOClient('http://localhost:8000');
  console.log(event.target.elements.message.value.trim());
//   if (JSON.parse(localStorage.getItem('Messages')) != null) {
//   allmessages = JSON.parse(localStorage.getItem('Messages'));
// }
   allmessages.push('admin: ' + event.target.elements.message.value.trim());
  // localStorage.setItem('Messages', JSON.stringify(allmessages));

  // allmessages.push('admin: ' + event.target.elements.message.value.trim());
  self.setState({messages: allmessages});
  socket.emit('chat message', event.target.elements.message.value.trim());
  event.target.elements.message.value = '';

}

  }

  render() {
    console.log(this.props);
    console.log(this.state.users);
    const userNames = this.state.users.map((user) => {
			return (
				<li key={user.name}>
					{user.name}
				</li>
			);
		});

    const messages = this.state.messages.map((msg) => {
			return (
				<li>
					{msg}
				</li>
			);
		});

    if(this.state.logout) {
      return <AdminLogin />
    }

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
            <button onClick={this.logout}>Logout</button>
          </div>
        </div>
      </div>
      <div className="flex full-height">
        <div className="sidebar">
          <button onClick={(event) => this.getUsers(event)}>Get Users</button>
          <ul>{userNames}</ul>
        </div>
        <div className="main">
          <ul id="messages">{messages}</ul>
          <form onSubmit={this.sendMessage}>
            <input id="m" name="message"  autoComplete="off"/>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>




      </div>
    );
  }
}


export default AdminHome;
