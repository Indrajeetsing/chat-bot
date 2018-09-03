import React, { Component } from 'react';
import AdminHome from './AdminHome';
import CustomerHome from './CustomerHome';
import axios from 'axios';
import apiBaseUrl from './Config';
import { socketEmit } from './SocketEvents';
import Landing from './Landing';

class AdminLogin extends Component {
  constructor(props){
    super(props);
    this.state={
    username:'',
    password:'',
    is_admin: false
  };

  this.handleNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  this.handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }


  this.handleClick =(event) => {
   const self = this;
   const payload  = {
       "name":this.state.username,
       "password":this.state.password,
      "is_admin" : this.state.is_admin
       }

   axios.post(apiBaseUrl+'signin', payload)
   .then(function (response) {
     console.log(response);
       if(response.data.success){
         console.log(response.data.token);
         self.setState({is_admin: response.data.is_admin, auth_token: response.data.token});
         if (!self.state.is_admin) {
           socketEmit.createRoom(self.state.username, (err) => {
             this.setState({error: err});
           })
         }
         // console.log(this.state.username);
       console.log("Login successfull");
       } else{
       console.log(response.data.message);
       alert(response.data.message);
       }
     })
     .catch(function (error) {
       console.log(error);
       });
     }

     this.back = () => {
       this.setState({goToLanding: true})
     }
   }

  render() {

    if(this.state.is_admin) {
      return <AdminHome auth_token={this.state.auth_token}/>
    } else if (!this.state.is_admin && this.state.auth_token !== undefined) {
      return <CustomerHome auth_token={this.state.auth_token} userName={this.state.username}/>
    }

    if(this.state.goToLanding) {
      return <Landing />
    }

    return (
      <div className="padding-top login-box">
        <h1 className="center"> Login </h1>
        <div className="height-50px center">
            <input type="text" name="username" placeholder="Enter Name" onChange={this.handleNameChange} />
        </div>
        <div  className="height-50px center">
            <input type="password" name="password" placeholder="Enter password" onChange={this.handlePasswordChange}/>
        </div>
        <div  className="height-50px center">
          <button className="pointer" onClick={(event) => this.handleClick(event)}>Login</button>
        </div>
        <div  className="height-50px center">
          <button className="pointer" onClick={this.back}> Back </button>
        </div>
      </div>
    );
  }
}


export default AdminLogin;
