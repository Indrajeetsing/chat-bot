import React, { Component } from 'react';
import AdminLogin from './AdminLogin';
import CustomerRegister from './CustomerRegister'

class Landing extends Component {
  constructor(props){
    super(props);
    this.state = { userType: null };

    this.goToAdmin = () => {
      this.setState({userType: "Admin"});
    }

    this.goToCustomer = () => {
      this.setState({userType: "Customer"});
    }

  }

  render() {
    if(this.state.userType === 'Admin') {
      console.log(this.state.userType);
      return <AdminLogin/>
    } else if (this.state.userType === 'Customer') {
        console.log(this.state.userType);
      return <CustomerRegister/>
    }
    return (
      <div className="App">
        <div className="admin-button-div">
            <button className="button pointer" onClick={this.goToAdmin}>Admin</button>
        </div>
        <div className="admin-button-div">
            <button className="button pointer"  onClick={this.goToCustomer}>Cutomer</button>
        </div>
      </div>
    );
  }
}


export default Landing;
