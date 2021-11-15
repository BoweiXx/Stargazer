import React from 'react';

export class Login extends React.Component {
    constructor(props){
        super(props);
        this.onTrigger = this.onTrigger.bind(this)
    }
    onTrigger(e) {
        console.log(this.props)
        this.props.onClick();
        e.preventDefault();
    }

    render() {
        return (
            <div id="login-container">
                <h1>Login</h1>
                <input id="username" style={{}}></input>
                <input id="password"></input>
                <button onClick={this.onTrigger}>Submit</button>
            </div>

        )
    }
}