function Plane() {
	// Plane flight details
	this.lastTime = null;
	this.speed = 200; // m/s
	this.heading = 0;
	this.location = {
		x: 779232,
		y: 5780430, //法国与瑞士边界，莱芒湖（日内瓦湖）
		z: 3000
	};
	this.attitude = {
		pitch: 0, // 向上为正
		roll: 0, //向右为正
		yaw: 0 //向右为正
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
		var data = {};
		for (var prop in this) {
			if (typeof this[prop] != "function") {
				data[prop] = this[prop];
			}
		}
		return JSON.stringify(data);
	};
}

module.exports = Plane;
