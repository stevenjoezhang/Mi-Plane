import React, { Component } from "react";
import FlightTable from "./flight-table";
import Overview from "./overview";
import "bootstrap/dist/css/bootstrap.css";
import "@arcgis/core/assets/esri/themes/light/main.css";
import "./App.css";

class App extends Component {
    render() {
        return <>
            <FlightTable/>
            <Overview/>
        </>;
    }
}

export default App;
