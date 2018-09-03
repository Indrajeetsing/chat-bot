import React, { Component } from 'react';
import AdminLogin from './AdminLogin'
import axios from 'axios';
import apiBaseUrl from './Config';

class CustomerRegister extends Component {
  constructor(props){
    super(props);
    this.state={
    username:'',
    password:'',
    is_admin: false,
    login_page: false
  };


  this.handleNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  this.handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }


  this.register = (event) => {
     const self = this;
     const payload={
     "name": this.state.username,
     "password":this.state.password,
     "is_admin" : false
     }
     axios.post(apiBaseUrl+'signup', payload)
    .then(function (response) {
      if(response.data.success){
        alert("Registration successfull");

      } else{
      alert(response.data.message);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
   }

    this.customerLogin = () => {
       this.setState({login_page: true});
    }

  }

  render() {
    if(this.state.login_page) {
      return <AdminLogin/>
    }
    return (
      <div className="padding-top login-box">
        <h1 className="center"> Sign Up </h1>
        <div className="height-50px center">
            <input type="text" name="username" placeholder="Enter Name" onChange={this.handleNameChange} />
        </div>
        <div  className="height-50px center">
            <input type="password" name="password" placeholder="Enter password" onChange={this.handlePasswordChange}/>
        </div>
        <div  className="height-50px center">
          <button onClick={(event) => this.register(event)}>Register</button>
        </div>
        <div  className="height-50px center">
          <button className="pointer" onClick={this.customerLogin}>Back to Login</button>
        </div>
      </div>
    );
  }
}

export default CustomerRegister;
