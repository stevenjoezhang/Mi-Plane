import React, { Component } from "react";
import { Range, getTrackBackground } from "react-range";
import background from "./images/aircraft-white-50.png";

class Slider extends Component {
    state = { values: [50] };
    render() {
        return (
            <Range
                step={0.1}
                min={0}
                max={100}
                values={this.state.values}
                onChange={(values) => this.setState({ values })}
                renderTrack={({ props, children }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: "6px",
                            width: "100%",
                            borderRadius: "4px",
                            background: getTrackBackground({
                                values: this.state.values,
                                colors: ["#548BF4", "#ccc"],
                                min: 0,
                                max: 100
                            })
                        }}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            background: `rgba(85,83,84,0.3) url(${background}) no-repeat 10px 8px`,
                            backgroundSize: "36px 36px",
                            borderRadius: "50%",
                            cursor: "move",
                            height: "50px",
                            left: 0,
                            position: "absolute",
                            top: 0,
                            width: "50px"
                        }}
                    />
                )}
            />
        );
    }
}

export default Slider;
