import React, { Component } from "react";
import { graphic, init } from "echarts";
import "./echarts.css";
import { ConvertMSToHHMM } from "./utils";
import Slider from "./slider";
import { Play, Pause } from "react-bootstrap-icons";

const transpose = array => array[0].map((r, i) => array.map(c => c[i]));

class Echarts extends Component {
    constructor(props) {
        super(props);
        this.element = React.createRef();
        this.db = props.db;
        this.db.echarts = this;
        this.state = {
            isPlaying: false,
            initialized: false
        };
        this.resetTimer();
    }

    resetTimer(t = 0) {
        this.refTime = t;
        this.startTime = Date.now();
    }

    play() {
        this.setState({
            isPlaying: true
        }, () => {
            this.resetTimer(this.lastTime);
            this.autoUpdate();
        });
    }

    pause() {
        this.setState({
            isPlaying: false
        });
    }

    autoUpdate() {
        if (!this.state.isPlaying) return;
        this.lastTime = Date.now() - this.startTime + this.refTime;
        this.db.update(this.lastTime);
        requestAnimationFrame(this.autoUpdate.bind(this));
    }

    update({ time, altitude, speed }) {
        this.option = {
            tooltip: {
                trigger: "axis",
                formatter: params => {
                    const content = params.map(item => `${item.seriesName}: ${item.data[1]}${["m", "km/h"][item.componentIndex]}`).join("<br>");
                    return ConvertMSToHHMM(params[0].axisValue - time[0]) + "<br>" + content;
                },
                axisPointer: {
                    lineStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: "rgba(0, 255, 233,0)"
                            }, {
                                offset: 0.5,
                                color: "rgba(255, 255, 255,1)",
                            }, {
                                offset: 1,
                                color: "rgba(0, 255, 233,0)"
                            }],
                            global: false
                        }
                    }
                }
            },
            grid: {
                top: "15%",
                left: "5%",
                right: "5%",
                bottom: "15%",
                containLabel: true
            },
            xAxis: [{
                type: "time",
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                boundaryGap: false
            }],

            yAxis: [{
                type: "value",
                name: "高度 (m)",
                nameLocation: "middle",
                nameGap: 60,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    margin: 20,
                    color: "#6c50f3"
                }
            }, {
                type: "value",
                name: "速度 (km/h)",
                nameLocation: "middle",
                nameGap: 50,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    margin: 20,
                    color: "#00ca95"
                }
            }],
            series: [{
                type: "line",
                name: "高度",
                symbolSize: 0,
                lineStyle: {
                    color: "#6c50f3",
                    shadowColor: "rgba(0, 0, 0, .3)",
                    shadowBlur: 0,
                    shadowOffsetY: 5,
                    shadowOffsetX: 5
                },
                label: {
                    show: false
                },
                tooltip: {
                    show: true
                },
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "rgba(108,80,243,0.3)"
                    }, {
                        offset: 1,
                        color: "rgba(108,80,243,0)"
                    }], false),
                    shadowColor: "rgba(108,80,243, 0.9)",
                    shadowBlur: 20
                },
                data: transpose([time, altitude])
            }, {
                type: "line",
                name: "速度",
                yAxisIndex: 1,
                symbolSize: 0,
                lineStyle: {
                    color: "#00ca95",
                    shadowColor: "rgba(0, 0, 0, .3)",
                    shadowBlur: 0,
                    shadowOffsetY: 5,
                    shadowOffsetX: 5
                },
                label: {
                    show: false
                },
                tooltip: {
                    show: true
                },
                areaStyle: {
                    color: new graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: "rgba(0,202,149,0.3)"
                    }, {
                        offset: 1,
                        color: "rgba(0,202,149,0)"
                    }], false),
                    shadowColor: "rgba(0,202,149, 0.9)",
                    shadowBlur: 20
                },
                data: transpose([time, speed])
            }, {
                type: "line",
                markLine: {
                    data: [],
                    label: {
                        show: false
                    },
                    animation: false
                }
            }]
        };
        this.setState({
            initialized: true
        });
        // 绘制图表
        if (!this.chart) this.chart = init(this.element.current);
        this.chart.setOption(this.option);
    }

    updateMarkLine(percentage) {
        if (!this.option) return;
        const xAxis = this.db.getTime(percentage / 100);
        this.option.series[2].markLine.data = [{ xAxis }];
        this.chart.setOption(this.option, false, true);
    }

    toggle() {
        this.state.isPlaying ? this.pause() : this.play();
    }

    render() {
        return <div className={`echarts-container${this.state.initialized ? "" : " d-none"}`}>
            <div className="echarts" ref={this.element} />
            <div className="slider d-flex">
                <button className="btn btn-outline-primary d-flex" type="button" onClick={this.toggle.bind(this)}>
                    {this.state.isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <Slider updateChart={this.updateMarkLine.bind(this)} />
            </div>
        </div>;
    }
}

export default Echarts;
