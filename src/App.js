import React, { Component } from "react";
import FlightTable from "./flight-table";
import Overview from "./overview";
import DataBase from "./database";
import Echarts from "./echarts";
import "bootstrap/dist/css/bootstrap.css";
import "@arcgis/core/assets/esri/themes/light/main.css";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.db = new DataBase();
    }

    render() {
        return <>
            <FlightTable db={this.db}/>
            <Overview db={this.db} />
            <Echarts db={this.db} />
        </>;
    }
}

export default App;
