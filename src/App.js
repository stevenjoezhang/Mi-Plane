import { Component } from "react";
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
