const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);

const Plane = require("./src/plane");

var port = 9500;

server.listen(port, () => {
	console.log("Server listening at port %d", port);
});
//Routing
app.use(express.static(path.join(__dirname, "public")));
app.get("/port", (req, res) => {
	res.end(port.toString());
});

var WebSocket = require("ws"),
	wss = new WebSocket.Server({
		clientTracking: true,
		maxPayload: 1300,
		server
	});

wss.on("connection", ws => {

	ws.on("message", data => {
		
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
setInterval(function() {
	plane.update();
	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) client.send(plane.stringify());
	});
}, 1000 / 30);
