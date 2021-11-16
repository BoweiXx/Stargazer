import React from "react";

export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.handleSetAzimuthMotor = this.handleSetAzimuthMotor.bind(this);
        this.handleSetAltitudeMotor = this.handleSetAltitudeMotor.bind(this);
        this.handleGetMotorStatus = this.handleGetMotorStatus.bind(this);
    }
    handleSetAzimuthMotor() {

    }
    handleSetAltitudeMotor() {

    }

    handleGetMotorStatus(){

    }

    render() {
        return (
            <div id="admin-wrapper">
                <div id="admin-container">
                    <input placeholder="Set Azimuth"></input>
                    <button onClick={this.handleSetAzimuthMotor}>Set Azimuth</button>
                    <input placeholder="Set Altitude"></input>
                    <button onClick={this.handleSetAltitudeMotor}>Set Altitude</button>
                    <button id = 'bigger-button' onClick = {this.handleGetMotorStatus}>Get Motor Status</button>
                </div>
            </div>
        )
    }
}