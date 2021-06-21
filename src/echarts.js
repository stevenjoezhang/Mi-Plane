import React, { Component } from "react";
import * as echarts from "echarts";
import "./echarts.css";
import { ConvertMSToHHMM } from "./utils";
const transpose = array => array[0].map((r, i) => array.map(c => c[i]));

class Echarts extends Component {
    constructor(props) {
        super(props);
        this.element = React.createRef();
        this.db = props.db;
        this.db.echarts = this.update.bind(this);
    }

    update({ time, altitude, speed }) {
        const option = {
            backgroundColor: "#080b30",
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
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
            }]
        };
        // 绘制图表
        this.chart.setOption(option);
    }

    componentDidMount() {
        this.chart = echarts.init(this.element.current);
    }

    render() {
        return <div className="echarts-container"><div className="echarts" ref={this.element} /></div>;
    }
}

export default Echarts;