import MiServer from "mimi-server";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { app, server } = new MiServer({
	port: 8080,
	static: path.join(__dirname, "public")
});

import Plane from "./src/plane.js";

// Routing
app.use("/js/jquery.slim.min.js", express.static(path.join(__dirname, "node_modules/jquery/dist/jquery.slim.min.js")));
app.use("/js/d3-format.min.js", express.static(path.join(__dirname, "node_modules/d3-format/dist/d3-format.min.js")));

import WebSocket from "ws";
const wss = new WebSocket.Server({
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

const plane = new Plane();
setInterval(() => {
	plane.update();
	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) client.send(plane.stringify());
	});
}, 1000 / 30);

import SerialPort from "serialport";
const serialport = new SerialPort("/dev/cu.usbmodem14202", {
	baudRate: 115200
});
let buffer = "";
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
