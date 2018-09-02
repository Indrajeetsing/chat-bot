import React, { Component } from 'react';
import AdminHome from './AdminHome';
import CustomerHome from './CustomerHome';
import axios from 'axios';

class AdminLogin extends Component {
  constructor(props){
    super(props);
    this.state={
    username:'',
    password:'',
    is_admin: false
  };

  // var login = false;

  this.handleNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  this.handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }


  this.handleClick =(event) => {
   var apiBaseUrl = "http://localhost:8000/";
   var self = this;
   var payload={
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
   }

  render() {

    if(this.state.is_admin) {
      return <AdminHome auth_token={this.state.auth_token}/>
    } else if (!this.state.is_admin && this.state.auth_token != undefined) {
      return <CustomerHome auth_token={this.state.auth_token} userName={this.state.username}/>
    }

    return (
      <div className="padding-top">
        <h1 className="center"> Login </h1>
        <div className="height-50px center">
            <input type="text" name="username" placeholder="Enter Name" onChange={this.handleNameChange} />
        </div>
        <div  className="height-50px center">
            <input type="password" name="password" placeholder="Enter password" onChange={this.handlePasswordChange}/>
        </div>
        <div  className="height-50px center">
          <button onClick={(event) => this.handleClick(event)}>Login</button>
        </div>

      </div>
    );
  }
}


export default AdminLogin;
