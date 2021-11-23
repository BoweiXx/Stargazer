import React from "react";
import { Userheader } from "./userheader";
// import { UserMain } from "./userMain";
export class User extends React.Component {
    constructor(porps) {
        super(porps);
        this.state = {
            onSearch: false,
        }
        this.handleSearchQuery = this.handleSearchQuery.bind(this);
    }
    handleSearchQuery = (name) => {
        let searchData = {
            lat: null,
            long: null,
            name: name
        };
        //this part is async
        navigator.geolocation.getCurrentPosition(async (e) => {
            console.log(e)
            searchData.lat = e.coords.latitude;
            searchData.long = e.coords.longitude;
            console.log(searchData);
            const responce = await fetch('/system/role/user/inactive/entity', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(searchData)
            });
            const result = await responce.text();
            if (result === 'found') {
                console.log('requested entity found!');
                //do something to guide user to the next page for reserving time
            } else {
                alert('Invalid search');
            }
        }, () => {
            console.log('To use the app, please enable the location access')
        })
    }
    render() {
        return (
            <div id="client-wrapper">
                <Userheader onClick={this.handleSearchQuery} />
                {/* <UserMain/> */}
            </div>
        )
    }
}