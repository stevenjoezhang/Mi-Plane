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

var WebSocketServer = require("ws").Server,
	wss = new WebSocketServer({
		clientTracking: true,
		maxPayload: 1300, //50个unicode字符最大可能大小（Emoji表情“一家人”）
		server
	});

//初始化
wss.on("connection", (ws) => {
	//发送消息
	ws.on("message", (data) => {
		
	});
	//退出聊天
	ws.on("close", (close) => {
	});
	//错误处理
	ws.on("error", (error) => {
		console.error("[ERROR] " + error);
	});
});

wss.on("error", (error) => {
	console.error("[ERROR] " + error);
});

var plane = new Plane();
setInterval(function() {
	plane.update();
	wss.clients.forEach(client => client.send(plane.stringify()));
}, 1000 / 30);

process.on("uncaughtException", (error) => {
	console.error("[FATAL ERROR] " + error);
	//process.exit(); //不强制退出可能产生不可控问题
});
