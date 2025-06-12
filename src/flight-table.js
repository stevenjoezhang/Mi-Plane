import React, { Component } from "react";
import Modal from "./modal.js";
import Loading from "./loading.js";
import { Modal as bsModal } from "bootstrap";
import { ConvertMSToHHMM } from "./utils.js";
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
        this.tableModal = props.tableModal;
        this.overviewModal = props.overviewModal;
        this.input = React.createRef();
        this.searchHistory = React.createRef();
    }

    trackLog(href) {
        bsModal.getInstance(this.tableModal.current).hide();
        new bsModal(this.overviewModal.current).show();
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
        const query = this.input.current.value.trim().toLowerCase();
        if (!query) {
            this.setState({
                valid: false
            });
            return;
        }
        this.setState({
            valid: true,
            loading: true
        });
        new bsModal(this.tableModal.current).show();
        fetch(`/flights/${query}/`)
            .then(response => response.json())
            .then(flights => {
                this.setState({
                    loading: false
                });
                if (!flights.length) {
                    alert("Flight not found!");
                    return;
                }
                this.searchHistory.current.addHistory(query);
                this.setState({
                    flights
                });
            });
    }

    componentDidMount() {
        this.input.current.focus();
    }

    render() {
        const nav = <nav className="navbar fixed-top navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Flight VIS</a>
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
                    <td>{new Date(row.departure * 1e3).toLocaleString()}</td>
                    <td>{new Date(row.actual * 1e3).toTimeString()} {row.origin}</td>
                    <td>{new Date(row.landingTimes * 1e3).toTimeString()} {row.destination}</td>
                    <td>{row.aircraftTypeFriendly}</td>
                    <td>{row.ete}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                        <button type="button" className="btn btn-primary" onClick={this.trackLog.bind(this, row.trackLog)}>预览</button>
                    </td>
                </tr>))}
            </tbody>
        </table>;
        return (<>
            {nav}
            <Modal title="航班查询" modalRef={this.tableModal}>
                {this.state.flights.length ? table : (this.state.loading ? <Loading /> : "")}
            </Modal>
        </>);
    }
}

export default FlightTable;
