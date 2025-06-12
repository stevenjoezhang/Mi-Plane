import { Component } from "react";
import "./loading.css";

class Loading extends Component {
    render() {
        return <div className="loading">
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
        </div>;
    }
}

export default Loading;
