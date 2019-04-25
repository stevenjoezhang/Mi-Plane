function Controller() {
	this.input = [0, 0];
	this.update = function(deltaT, data) {
		if (!data.enable[1]) {
			data.attitude.roll += this.input[0] / 100 * 10;
			data.heading += data.attitude.roll / 500;
			// 转360bug
		}
		if (!data.enable[2]) {
			data.attitude.pitch += this.input[1] / 20 * 10;
			data.vspeed = Math.tan(data.attitude.pitch * Math.PI / 180) * 28;
			// 还需要计算攻角导致的减速
		}

		return data;
	}
}

module.exports = Controller;
