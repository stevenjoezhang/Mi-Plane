(() => {
	// Enforce strict mode
	"use strict";

	window.plane = {
		position: {
			x: 12988000,
			y: 4865000,
			z: 3000
		},
		attitude: {
			pitch: 0,
			roll: 0,
			yaw: 0
		},
		speed: 120,
		heading: 270
	};

	const protocol = location.protocol.replace("http", "ws");

	function wsinit() {
		window.ws = new WebSocket(`${protocol}//${location.host}`);
		ws.onopen = () => {
			console.log("Websocket connection is successful");
		};

		ws.onmessage = event => {
			plane = JSON.parse(event.data);
			update();
		};

		ws.onclose = () => {
			console.log("Websocket connection failed, please refresh the page and try again");
			setTimeout(wsinit, 5000);
		};
	}
	wsinit();

	function update() {
		document.querySelector("#speed input").value = format.format(",")(plane.speed);
		document.querySelector("#altitude input").value = format.format(",")(plane.position.z);
		document.querySelector("#heading input").value = format.format(",")(plane.heading);
	}
	update();
})();

document.getElementById("button-speed-up").addEventListener("click", () => {
	speed += 100;
});
document.getElementById("button-speed-dn").addEventListener("click", () => {
	speed -= 100;
	if (speed < 0) {
		speed = 0;
	}
});
document.getElementById("button-altitude-up").addEventListener("click", () => {
	position.z += 100;
});
document.getElementById("button-altitude-dn").addEventListener("click", () => {
	position.z -= 100;
	if (position.z < 0) {
		position.z = 0;
	}
});
document.getElementById("button-heading-up").addEventListener("click", () => {
	heading += 10;
	if (heading > 360) {
		heading -= 360;
	}
});
document.getElementById("button-heading-dn").addEventListener("click", () => {
	heading -= 10;
	if (heading < 0) {
		heading += 360;
	}
});
