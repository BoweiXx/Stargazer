import React from "react";
import { Userheader } from "./userheader";
export class User extends React.Component {
    constructor(porps) {
        super(porps);
        this.state = {
            onSearch: false,
        }
        this.handleSearchQuery = this.handleSearchQuery.bind(this);
    }
    handleSearchQuery = async (name) => {
        console.log(name)
        const req = fetch('/system/role/user/inactive/entity', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "name": name })
        });
        const result = await (await req).text();
        if (result === 'found') {
            console.log('requested entity found!');
            //do something to guide user to the next page for reserving time
        } else {
            alert('Invalid search');
        }
    }
    render() {
        return (
            <div id="client-wrapper">
                <Userheader onClick={this.handleSearchQuery} />
            </div>
        )
    }
}