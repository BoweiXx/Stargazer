import React from 'react';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.adminLogin = this.adminLogin.bind(this);
        this.userLogin = this.userLogin.bind(this);
    }
    adminLogin(e) {
        this.props.admin();
        e.preventDefault();
    }

    userLogin(e) {
        this.props.user();
        e.preventDefault();
    }

    render() {
        return (
            <div id = 'back'>
                <div id="login-container">
                    <h2>Login</h2>
                    <h6>If you are not admin, please continue as guest</h6>
                    <input id="username" placeholder="username"></input>
                    <input id="password" placeholder="password"></input>
                    <button onClick={this.adminLogin}>Login as Admin</button>
                    <button onClick={this.userLogin}>Continue As Guest</button>
                </div>
            </div>
        )
    }
}