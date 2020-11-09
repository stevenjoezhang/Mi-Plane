class WebSocketController {
	constructor(url, callback) {
		this.url = url;
		this.callback = callback;
		this.init();
	}

	init() {
		this.ws = new WebSocket(this.url);

		this.ws.onopen = () => {
			console.log("Websocket connection is successful");
		};

		this.ws.onmessage = this.callback;

		this.ws.onclose = () => {
			console.log("Websocket connection failed, please refresh the page and try again");
			setTimeout(() => {
				this.init();
			}, 5000);
		};
	}
}
