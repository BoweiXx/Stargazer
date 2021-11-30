import React from "react";

export class UserMain extends React.Component {
    constructor(props) {
        super(props);
        this.getTodayPic = this.getTodayPic.bind(this);
    }

    async getTodayPic() {
        let res = await fetch('/system/role/user/APIKEY');
        let key = await res.json();
        let imgRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${key.key} `);
        let imgData = await imgRes.json();
        const mainWrapper = document.getElementById('img-wrapper');
        const imgBox = document.createElement('img');
        imgBox.setAttribute("src", imgData['url']);
        mainWrapper.appendChild(imgBox);
        console.log(imgData)
        const desWrapper = document.getElementById('des-wrapper');
        const title = document.createElement('h2');
        title.innerHTML = 'Daily Photo by: ' + imgData['copyright'];
        const explanation = document.createElement('p');
        explanation.innerHTML = imgData['explanation'];
        desWrapper.appendChild(title);
        desWrapper.appendChild(explanation)
    }
    componentDidMount() {
        this.getTodayPic();
    }

    render() {
        return (
            <div id = "user-main">
                <div id="img-wrapper">
                    
                </div>
                <div id = "des-wrapper">
                </div>
            </div>

        )
    }
}