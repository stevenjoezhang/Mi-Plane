import React, { Component } from 'react';

class FlightTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.load();
    }

    load() {
        fetch("http://localhost:8080/flights/3U8834/")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({
                    data: Object.values(data.flights)[0].activityLog.flights
                });
            });
    }

    render() {
        return (
            this.state.data.map(row => (<tr key={row.flightId}>
                <td><a href={row.links.trackLog}>{new Date(row.flightPlan.departure * 1e3).toLocaleString()}</a></td>
                <td>{new Date(row.takeoffTimes.actual * 1e3).toTimeString() + row.origin.friendlyName}</td>
                <td>{new Date(row.landingTimes.actual * 1e3).toTimeString() + row.destination.friendlyName}</td>
                <td>{row.aircraftTypeFriendly}</td>
                <td>{row.flightPlan.ete / 60 + "分"}</td>
            </tr>))
        );
    }
}

export default FlightTable;
