import React, { Component } from "react";
import Modal from "./modal";

class Overview extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const element = <div id="overview-map"></div>;
        return (
            <Modal id="overview-modal" title="航线预览" body={element} />
        );
    }
}

export default Overview;
