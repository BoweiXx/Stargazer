import React from "react";
import { Userheader } from "./userheader";
export class User extends React.Component {
    constructor(porps) {
        super(porps);
        this.state = {}
    }

    render() {
        return (
            <div id="client-wrapper">
                <Userheader />

            </div>
        )
    }
}