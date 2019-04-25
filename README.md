# Mi Plane

A basic flight simulator with four synchronized views.

Click [here](http://richiecarmichael.github.io/simulator/index.html) or [here](http://maps.esri.com/rc/simulator/index.html) to view the live application.

### This application makes use of the following libraries:

* [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/) by [Esri](http://www.esri.com/)
  - Esri's JavaScript library for mapping and analysis.
* [d3-format](https://github.com/d3/d3-format) by [Mike Bostock](https://github.com/mbostock)
  - Format numbers for human consumption.
* [jQuery](http://jquery.com/) by jQuery Foundataion Inc
  - A JavaScript framework for DOM manipulation and a foundation for many other frameworks.
* [jQuery-Flight-Indicators](https://github.com/sebmatton/jQuery-Flight-Indicators) by [Matton Sébastien](https://github.com/sebmatton)
  - The Flight Indicators Plugin allows you to display high quality flight indicators using html, css3, jQuery and SVG vector images.

### The App in Action:
![](./simulator.gif)

### 简写对照

| 简写 | 全称 | 中文 |
| - | - | - |
| PWR | Power | 节流阀位置 |
| NAV | Navigator | 导航（航路点） |
| SPD | Speed | 空速 |
| HDG | Heading | 航向 |
| ALT | Altitude | 高度 |
| VS | Vertical Speed | 升降速率 |
| A/P | Auto Pilot | 自动驾驶 |

TRIM,FLAPS,SPOILERS,GEAR,BREAKS等与起降有关的内容不做处理。

### 仪表

| 仪表名 | 中文 | 接受输入
| - | - | - |
| airspeed | 空速表 | speed |
| attitude | 姿态指示仪 | roll,pitch |
| altimeter | 高度表 | altitude,pressure |
| turn_coordinator | 转弯、侧滑指示仪 | turn |
| heading | 远读式陀螺罗盘 | heading |
| variometer | 升降速率表 | vertical_speed |

向仪表盘传递的参数为：
speed,roll,pitch,altitude,turn,heading

pressure由altitude计算，vertical_speed由altitude做差/求导计算。

### 控制

#### 用户输入

micro:bit传感器自由度：倾角（roll,pitch,即俯仰和转向）和节流阀，使用时需按键配平；

使用键盘、鼠标可以进行更详尽的操作。

#### AP设置内容

；

在A/P开启时，不接受输入（或在操作幅度较大时解除A/P）。

### 数据结构与算法

#### 概述
为保证参数自洽性，所有输入参数通过Websocket传递到服务器进行计算，然后向各个屏幕输出。将运算与现实分离。

#### Camera
在转向过程中，需要改变Camera的tilt

### TODO

- [ ] ICAO 航路点，在A/P中设置
- [ ] 允许通过A/P设置自动油门
- [ ] 允许用户手动调整Camera参数
- [ ] GPWS
