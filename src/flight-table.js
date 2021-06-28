import React, { Component } from "react";
import Modal from "./modal";
import Loading from "./loading";
import { Modal as bsModal } from "bootstrap";
import { ConvertMSToHHMM } from "./utils";
import "./flight-table.css";

class SearchHistory extends Component {
    constructor(props) {
        super(props);
        this.input = this.props.input;
        this.search = this.props.search;
        this.state = {
            history: this.getHistory()
        };
    }

    getHistory() {
        const history = localStorage.getItem("flight-vis");
        if (!history) return new Set();
        return new Set(JSON.parse(history));
    }

    saveHistory() {
        localStorage.setItem("flight-vis", JSON.stringify([...this.state.history]));
    }

    addHistory(item) {
        const history = new Set(this.state.history);
        history.add(item);
        this.setState({
            history
        }, this.saveHistory);
    }

    removeHistory(item) {
        const history = new Set(this.state.history);
        history.delete(item);
        this.setState({
            history
        }, this.saveHistory);
    }

    applyHistory(item) {
        this.input.current.value = item;
        this.search();
    }

    render() {
        return (this.state.history.size ? <ul className="list-group position-absolute search-history">
            {[...this.state.history].map(row => <li className="list-group-item d-flex justify-content-between align-items-center" key={row}>
                <button className="btn flex-grow-1 text-start" onClick={this.applyHistory.bind(this, row)}>{row}</button>
                <button type="button" className="btn-close" aria-label="Close" onClick={this.removeHistory.bind(this, row)}></button>
            </li>)}
        </ul> : "");
    }
}

class FlightTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: true,
            flights: [],
            loading: false
        };
        this.db = props.db;
        this.modal = React.createRef();
        this.input = React.createRef();
        this.searchHistory = React.createRef();
    }

    trackLog(href) {
        fetch(href)
            .then(response => response.json())
            .then(data => {
                this.db.loadData(data);
            });
    }

    handleKeyDown(event) {
        if (event.key === "Enter") {
            this.search();
        }
    }

    search() {
        if (!this.input.current.value) {
            this.setState({
                valid: false
            });
            return;
        }
        this.setState({
            valid: true,
            loading: true
        });
        new bsModal(this.modal.current).show();
        fetch(`/flights/${this.input.current.value}/`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    loading: false
                });
                data = Object.values(data.flights)[0];
                if (!data.iataIdent) {
                    alert("Flight not found!");
                    return;
                }
                this.searchHistory.current.addHistory(data.iataIdent);
                this.setState({
                    flights: data.activityLog.flights.filter(row => row.flightPlan?.departure)
                });
            });
    }

    componentDidMount() {
        this.input.current.focus();
    }

    render() {
        const nav = <nav className="navbar fixed-top navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Mi Plane</a>
                <div className="d-flex position-relative">
                    <input className={`form-control me-2${this.state.valid ? "" : " is-invalid"}`} type="text" placeholder="航班号" aria-label="航班号" onKeyDown={this.handleKeyDown.bind(this)} ref={this.input} />
                    <SearchHistory input={this.input} ref={this.searchHistory} search={this.search.bind(this)} />
                    <button className="btn btn-outline-success flex-shrink-0" type="button" onClick={this.search.bind(this)}>搜索</button>
                </div>
            </div>
        </nav>;
        const table = <table className="table mt-3">
            <thead>
                <tr>
                    <th>日期</th>
                    <th>离港</th>
                    <th>到达</th>
                    <th>飞机</th>
                    <th style={{ whiteSpace: "nowrap" }}>飞行时间</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {this.state.flights.map(row => (<tr key={row.flightId}>
                    <td>{new Date(row.flightPlan.departure * 1e3).toLocaleString()}</td>
                    <td>{new Date(row.takeoffTimes.actual * 1e3).toTimeString() + row.origin.friendlyName}</td>
                    <td>{new Date(row.landingTimes.actual * 1e3).toTimeString() + row.destination.friendlyName}</td>
                    <td>{row.aircraftTypeFriendly}</td>
                    <td>{ConvertMSToHHMM(row.flightPlan.ete * 1000)}</td>
                    <td style={{ whiteSpace: "nowrap" }}><button type="button" className="btn btn-primary" onClick={this.trackLog.bind(this, row.links.trackLog)} data-bs-toggle="modal" data-bs-target="#overview-modal" data-bs-dismiss="modal">预览</button></td>
                </tr>))}
            </tbody>
        </table>;
        return (<>
            {nav}
            <Modal title="航班查询" modalRef={this.modal} id="flight-table">
                {this.state.flights.length ? table : (this.state.loading ? <Loading /> : "")}
            </Modal>
        </>);
    }
}

export default FlightTable;
