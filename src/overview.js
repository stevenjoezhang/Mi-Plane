import { Component } from "react";
import Modal from "./modal.js";
import "./overview.css";

class Overview extends Component {
    constructor(props) {
        super(props);
        this.db = props.db;
    }

    view() {
        this.db.echarts.play();
    }

    componentDidMount() {
        this.db.initOverview();
    }

    render() {
        const footer = <>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#flight-table">返回</button>
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={this.view.bind(this)}>查看</button>
        </>;
        return (
            <Modal id="overview-modal" title="航线预览" footer={footer}>
                <div id="overview-map"></div>
            </Modal>
        );
    }
}

export default Overview;
