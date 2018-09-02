import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import AdminLogin from './AdminLogin';

class CustomerHome extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      logout: false
    }

      const socket = socketIOClient('http://localhost:8000');


      var allmessages = this.state.messages;
      var userName = this.props.userName;
      this.sendMessage = (event) => {
        event.preventDefault();
        var self = this;
        console.log(event.target.elements.message.value.trim());
         allmessages.push(userName +': ' + event.target.elements.message.value.trim());
        self.setState({messages: allmessages});
        socket.emit('chat message', event.target.elements.message.value.trim());
        event.target.elements.message.value = '';

      }

      this.logout = () => {
        this.setState({logout: true});
      }

  }

  render() {

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
              <h1>{this.props.userName} Home</h1>
            </div>
        </div>
        <div className="flex-1">
          <div  className="float-right logout-button">
            <button onClick={this.logout}>Logout</button>
          </div>
        </div>
      </div>
      <div className="flex full-height">
        <ul className="full-width" id="messages">{messages}</ul>
        <form onSubmit={this.sendMessage}>
          <input className="width-88" id="m" name="message" autoComplete="off"/>
          <button type="submit">Send</button>
        </form>
      </div>




      </div>
    );
  }
}


export default CustomerHome;
