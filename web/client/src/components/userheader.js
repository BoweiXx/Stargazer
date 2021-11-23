import React from 'react'
export class Userheader extends React.Component {
    constructor(props) {
        super(props);
        this.onTrigger = this.onTrigger.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    onTrigger() {
        const name = document.getElementById('user-search-bar').value;
        this.props.onClick(name);
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.onTrigger();
        }
    }
    render() {
        return (
            <header id="user-header-container">
                <input placeholder="What do you want to take pictures of today?" id="user-search-bar" onKeyPress={this.handleKeyPress}></input>
                <span>From</span>
                <input type = "time" id = "start-time"></input>
                <span>To</span>
                <input type = "time" id = "end-time"></input>
                <button id="user-search-button" onClick={this.onTrigger} >Search</button>
            </header>
        )
    }
}