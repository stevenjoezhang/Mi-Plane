const Controller = require("./controller");
const Autopilot = require("./autopilot");

function Plane() {
	// Plane flight details
	this.data = {
		position: {
			x: 12988000,
			y: 4865000,
			z: 5000
		},
		attitude: {
			pitch: 0, // 向上为正
			roll: 0, //向右为正
			yaw: 0 //向右为正
		},
		//this.power = 0;
		speed: 180, // m/s
		heading: 270,
		vspeed: 0,
		power: 0,
		enable: [0, 0, 0, 0]
	}
	this.controller = new Controller();
	this.autopilot = new Autopilot();
	this.lastTime = null;
	this.update = function() {
		const time = Date.now();
		const deltaT = this.lastTime ? time - this.lastTime : 0; // ms
		this.lastTime = time;

		this.data = this.controller.update(deltaT, this.data);
		this.data = this.autopilot.update(deltaT, this.data);
		this.updatePosition(deltaT);
	};
	this.updatePosition = function(deltaT) {
		const deltaS = this.data.speed * deltaT / 1000;

		this.data.position.x += deltaS * Math.sin(this.data.heading * Math.PI / 180);
		this.data.position.y += deltaS * Math.cos(this.data.heading * Math.PI / 180);
		this.data.position.z += this.data.vspeed * deltaT / 1000;
	};
	this.stringify = function() {
		return JSON.stringify(this.data);
	};
}

module.exports = Plane;
