const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);

const Plane = require("./src/plane");

var port = 8080;

server.listen(port, () => {
	console.log("Server listening at port %d", port);
});
//Routing
app.use(express.static(path.join(__dirname, "public")));

var WebSocket = require("ws"),
	wss = new WebSocket.Server({
		clientTracking: true,
		maxPayload: 1300,
		server
	});

wss.on("connection", ws => {

	ws.on("message", data => {
		if (!plane) return;
		data = JSON.parse(data);
		switch(data.type) {
			case "autopilot":
				plane.data.enable = data.enable;
				plane.autopilot.config = data.config;
				break;
			case "set":
				plane.data = data.data;
			case "analog_input":
				plane.controller.input = data.input;
			default:
				break;
		}
	});

	ws.on("close", close => {
	});

	ws.on("error", error => {
		console.error("[ERROR] " + error);
	});
});

wss.on("error", error => {
	console.error("[ERROR] " + error);
});

var plane = new Plane();
setInterval(() => {
	plane.update();
	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) client.send(plane.stringify());
	});
}, 1000 / 30);

var SerialPort = require("serialport");
var serialport = new SerialPort("/dev/cu.usbmodem14202", {
	baudRate: 115200
});
buffer = "";
// Switches the serialport into "flowing mode"
serialport.on("data", data => {
	char = data.toString();
	buffer += char;
	if (char === "\n") {
		if (buffer[0] === "(") {
			value = buffer.split("(")[1].split(")")[0].split(",");
			accelerometer = value.map(x => parseFloat(x));
			console.log("Data:", accelerometer);
			plane.controller.input = accelerometer;
		}
		buffer = "";
	}
}).on("error", console.error);
