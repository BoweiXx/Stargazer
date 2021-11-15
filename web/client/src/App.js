import React, { Component } from 'react';
import { Login } from './components/login'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  state = {
    response: '',
    post: '',
    responseToPost: '',
    role: null
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
    navigator.geolocation.getCurrentPosition((e) => {
      console.log(e)
    }, () => {
      console.log('eeeeer')
    })
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
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

  handleLogin = async () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let temp = { username, password };
    const res = await fetch('/system/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(temp)
    })
    let newState = await res.text();
    if(newState){
      this.setState({ role: 'Admin' });
    }
    console.log(this.state)
  }
  render() {
    return (
      <div className="App">
        <Login onClick={this.handleLogin} />
      </div>
    );
  }
}

export default App;