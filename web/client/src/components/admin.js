import React from "react";

export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.handleSetAzimuthMotor = this.handleSetAzimuthMotor.bind(this);
        this.handleSetAltitudeMotor = this.handleSetAltitudeMotor.bind(this);
        this.handleGetMotorStatus = this.handleGetMotorStatus.bind(this);
    }
    handleSetAzimuthMotor = async () => {
        const az = document.getElementById('azimuth').value;
        const res = await fetch('/system/role/admin/turntable/azimuth', {
            method: 'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify({az})
        });
        let success = await res.text();
        if(success === 'updated'){
            console.log('Updated azimuth to server')
        }else{
            alert('Invalid Input, Please Enter number from 0 to 360')
        }
    }
    handleSetAltitudeMotor = async () => {
        const al = document.getElementById('altitude').value;
        const res = await fetch('/system/role/admin/turntable/altitude', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({al})
        });
        let success = await res.text();
        if(success === 'updated'){
            console.log('Updated azimuth to server')
        }else{
            alert('Invalid Input, Please Enter number from 0 to 360')
        }
    }
    //TODO: use form
    handleGetMotorStatus = async () => {
        const response = await fetch('/system/role/admin/turntablestatus');
        const motorStatus = await response.json();
        const az = motorStatus['az'];
        const al = motorStatus['alt'];
        const tempP = document.createElement('p');
        const container = document.getElementById('admin-container');
        container.appendChild(tempP);
        tempP.style = "color: white"
        tempP.innerHTML = `Azimuth: ${az}, Altitude: ${al} at time ${new Date()}`;
    }

    render() {
        return (
            <div id="admin-wrapper">
                <div id="admin-container">
                    <input placeholder="Set Azimuth" id = 'azimuth'></input>
                    <button onClick={this.handleSetAzimuthMotor}>Set Azimuth</button>
                    <input placeholder="Set Altitude" id = 'altitude'></input>
                    <button onClick={this.handleSetAltitudeMotor}>Set Altitude</button>
                    <button id='bigger-button' onClick={this.handleGetMotorStatus}>Get Motor Status</button>
                </div>
            </div>
        )
    }
}