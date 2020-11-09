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
	new WebSocketController(`${protocol}//${location.host}`, event => {
		plane = JSON.parse(event.data);
		update();
	});

	function update() {
		document.querySelector("#speed input").value = d3.format(",")(plane.speed);
		document.querySelector("#altitude input").value = d3.format(",")(plane.position.z);
		document.querySelector("#heading input").value = d3.format(",")(plane.heading);
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
