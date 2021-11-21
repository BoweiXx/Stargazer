import React from "react";

export class UserImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentImage: null
        }
        this.fetchImage = this.fetchImage.bind(this);
    }

    fetchImage = async () => {
        
    }

    render() {
        return (
            <div id="image-of-the-day">

            </div>)
    }
}