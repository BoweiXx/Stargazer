import React from 'react'
export class Userheader extends React.Component {
    constructor(props) {
        super(props);
        this.onTrigger = this.onTrigger.bind(this);
    }

    onTrigger() {
        
    }
    render() {
        return (
            <div id="user-header-container">
                <image ></image>
                <input placeholder="What do you want to take pictures of today?" id ="user-search-bar"></input>
                <button id = "user-search-button">Search</button>            
            </div>
        )
    }
}