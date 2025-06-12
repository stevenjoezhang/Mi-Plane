import { Component } from "react";
import Modal from "./modal.js";
import { Modal as bsModal } from "bootstrap";
import "./overview.css";

class Overview extends Component {
    constructor(props) {
        super(props);
        this.db = props.db;
        this.tableModal = props.tableModal;
        this.overviewModal = props.overviewModal;
    }

    back() {
        bsModal.getInstance(this.overviewModal.current).hide();
        bsModal.getInstance(this.tableModal.current).show();
    }

    view() {
        bsModal.getInstance(this.overviewModal.current).hide();
        this.db.echarts.play();
    }

    componentDidMount() {
        this.db.initOverview();
    }

    render() {
        const footer = <>
            <button type="button" className="btn btn-secondary" onClick={this.back.bind(this)}>返回</button>
            <button type="button" className="btn btn-primary" onClick={this.view.bind(this)}>查看</button>
        </>;
        return (
            <Modal title="航线预览" modalRef={this.overviewModal} footer={footer}>
                <div id="overview-map"></div>
            </Modal>
        );
    }
}

export default Overview;
