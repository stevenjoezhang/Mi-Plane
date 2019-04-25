function Autopilot() {
	//speed, heading, vspeed, altitude
	this.config = [120, 0, 0, 3000];
	this.update = function(deltaT, data) {
		if (data.enable[0]) {
			var deltaV = this.config[0] - data.speed;
			var dV = deltaV > 0 ? 0.1 : -0.1;
			data.speed += dV;
		}
		if (data.enable[1]) {
			var deltaTheta = this.config[1] - data.heading;
			var dTheta = 0;
			if (deltaTheta > 1) dTheta = 0.1;
			if (deltaTheta < -1) dTheta = -0.1;
			data.heading += dTheta;
			data.attitude.roll = dTheta * 100;
		}
		if (data.enable[2] && !data.enable[3]) {
			var deltaVS = this.config[2] - data.vspeed;
			var dVS = deltaVS > 0 ? 0.1 : -0.1;
			data.vspeed += dVS;
		}
		if (data.enable[3] && !data.enable[2]) {
			var deltaZ = this.config[3] - data.location.z;
			//if (deltaZ < -5000) config.
		}
		if (data.enable[2] && data.enable[3]) {
			;
		}
		return data;
	}
}

module.exports = Autopilot;
