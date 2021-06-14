import React, { Component } from "react";
import Modal from "./modal";
import DataBase from "./database";
import Loading from "./loading";

class FlightTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            flights: []
        };
        this.db = new DataBase();
        this.modal = React.createRef();
        this.input = React.createRef();
    }

    load() {
        fetch(`http://localhost:8080/flights/${this.state.value}/`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    flights: Object.values(data.flights)[0].activityLog.flights.filter(row => row.flightPlan?.departure)
                });
            });
    }

    trackLog(href) {
        fetch(`http://localhost:8080${href}`)
            .then(response => response.json())
            .then(data => {
                this.db.loadData(data);
                window.db = this.db;
                //this.db.autoUpdate();
            });
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleKeyDown(event) {
        if (event.key === "Enter") {
            this.load();
        }
    }

    componentDidMount() {
        this.modal.current.addEventListener("shown.bs.modal", () => {
            this.input.current.focus();
        });
    }

    render() {
        const input = <div className="input-group">
            <input type="text" className="form-control" placeholder="航班号" aria-label="航班号" value={this.state.value} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)} ref={this.input}/>
            <button className="btn btn-outline-secondary" type="button" onClick={this.load.bind(this)}>搜索</button>
        </div>;
        const table = <table className="table mt-3">
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
                {this.state.flights.map(row => (<tr key={row.flightId}>
                    <td>{new Date(row.flightPlan.departure * 1e3).toLocaleString()}</td>
                    <td>{new Date(row.takeoffTimes.actual * 1e3).toTimeString() + row.origin.friendlyName}</td>
                    <td>{new Date(row.landingTimes.actual * 1e3).toTimeString() + row.destination.friendlyName}</td>
                    <td>{row.aircraftTypeFriendly}</td>
                    <td>{Math.floor(row.flightPlan.ete / 60) + "分"}</td>
                    <td style={{ whiteSpace: 'nowrap' }}><button type="button" className="btn btn-primary" onClick={this.trackLog.bind(this, row.links.trackLog)} data-bs-toggle="modal" data-bs-target="#overview-modal" data-bs-dismiss="modal">预览</button></td>
                </tr>))}
            </tbody>
        </table>;
        const element = <>{input}{this.state.flights.length ? table : <Loading/>}</>;
        return (
            <Modal id="staticBackdrop" title="航班查询" modalRef={this.modal}>
                {element}
            </Modal>
        );
    }
}

export default FlightTable;
