import React, { Component } from 'react';
import { Login } from './components/login';
import { Admin } from './components/admin';
import { User } from './components/user';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleAdminLogin = this.handleAdminLogin.bind(this);
    this.handleUserLogin = this.handleUserLogin.bind(this)
  }

  state = {
    response: '',
    post: '',
    responseToPost: '',
    role: null
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();

    this.setState({ responseToPost: body });
  };

  handleAdminLogin = async () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let temp = { username, password };
    const res = await fetch('/system/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(temp)
    })
    let newState = await res.text();
    if (newState === 'true') {
      this.setState({ role: 'Admin' });
    } else {
      window.alert('Incorrect Username or Password')
    }
    console.log(this.state)
  }

  handleUserLogin() {
    this.setState({ role: 'User' });
  }
  render() {
    if(this.state.role === null){
      return (
        <div className="App">
          <Login admin={this.handleAdminLogin} user={this.handleUserLogin} />
        </div>
      );
    }else if(this.state.role === 'Admin'){
      return(<Admin/>)
    }else if(this.state.role === 'User'){
      return(<User/>)
    }
    
  }
}

export default App;