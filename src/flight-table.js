import React, { Component } from "react";
import Modal from "./modal";

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
                this.setState({
                    data: Object.values(data.flights)[0].activityLog.flights
                });
            });
    }

    trackLog(href) {
        console.log(href);
        fetch(`http://localhost:8080${href}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
    }

    render() {
        const element = <table className="table">
            <thead>
                <tr>
                    <th>日期</th>
                    <th>离港</th>
                    <th>到达</th>
                    <th>飞机</th>
                    <th style={{ whiteSpace: 'nowrap' }}>飞行时间</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {this.state.data.map(row => (<tr key={row.flightId}>
                    <td>{new Date(row.flightPlan.departure * 1e3).toLocaleString()}</td>
                    <td>{new Date(row.takeoffTimes.actual * 1e3).toTimeString() + row.origin.friendlyName}</td>
                    <td>{new Date(row.landingTimes.actual * 1e3).toTimeString() + row.destination.friendlyName}</td>
                    <td>{row.aircraftTypeFriendly}</td>
                    <td>{row.flightPlan.ete / 60 + "分"}</td>
                    <td style={{ whiteSpace: 'nowrap' }}><button type="button" className="btn btn-primary" onClick={() => this.trackLog(row.links.trackLog)}>查看</button></td>
                </tr>))}
            </tbody>
        </table>;
        return (
            <Modal title={'航班查询'} body={element}/>
        );
    }
}

export default FlightTable;
