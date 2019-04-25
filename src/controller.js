function Controller() {
	this.input = [0, 0];
	this.update = function(deltaT, data) {
		if (!data.enable[1]) {
			data.attitude.roll += this.input[0] / 1000;
			data.heading += data.attitude.roll / 100;
		}
		if (!data.enable[2]) {
			data.attitude.pitch += this.input[1] / 20;
			data.vspeed = data.attitude.pitch / 5;
		}

		return data;
	}
}

module.exports = Controller;
