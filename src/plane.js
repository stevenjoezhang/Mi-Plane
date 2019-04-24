function Plane() {
	// Plane flight details
	this.lastTime = null;
	this.speed = 200; // m/s
	this.heading = 0;
	this.location = {
		x: 779232,
		y: 5780430,
		z: 3000
	};
	this.update = function() {

		//var h = viewMain.rotation;
		var time = new Date().getTime();
		var deltaT = this.lastTime ? time - this.lastTime : 0; // ms
		var deltaS = this.speed * deltaT / 1000;

		this.location.x += deltaS * Math.sin(-this.heading * Math.PI / 180);
		this.location.y += deltaS * Math.cos(-this.heading * Math.PI / 180);
		this.location.z = this.location.z;

		this.lastTime = time;
	};
	this.stringify = function() {
		var data = {
			x: this.location.x,
			y: this.location.y,
			z: this.location.z,
			heading: this.heading,
			speed: this.speed
		};
		return JSON.stringify(data);
	};
}

module.exports = Plane;
