import React, { Component } from "react";
import FlightTable from "./flight-table.js";
import Overview from "./overview.js";
import DataBase from "./database.js";
import Echarts from "./echarts.js";
import "bootstrap/dist/css/bootstrap.css";
import "@arcgis/core/assets/esri/themes/light/main.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.db = new DataBase();
        this.tableModal = React.createRef();
        this.overviewModal = React.createRef();
    }

    render() {
        return <>
            <FlightTable db={this.db} tableModal={this.tableModal} overviewModal={this.overviewModal} />
            <Overview db={this.db} tableModal={this.tableModal} overviewModal={this.overviewModal} />
            <Echarts db={this.db} />
        </>;
    }
}

export default App;
