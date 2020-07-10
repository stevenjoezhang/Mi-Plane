function Autopilot() {
	//speed, heading, vspeed, altitude
	this.config = [120, 0, 0, 3000];
	this.update = function(deltaT, data) {
		if (data.enable[0]) {
			const deltaV = this.config[0] - data.speed;
			const dV = deltaV > 0 ? 0.1 : -0.1;
			data.speed += dV;
		}
		if (data.enable[1]) {
			const deltaTheta = this.config[1] - data.heading;
			let dTheta = 0;
			if (deltaTheta > 1) dTheta = 0.1;
			if (deltaTheta < -1) dTheta = -0.1;
			data.heading += dTheta;
			data.attitude.roll = dTheta * 100;
		}
		if (data.enable[2] && !data.enable[3]) {
			const deltaVS = this.config[2] - data.vspeed;
			const dVS = deltaVS > 0 ? 0.1 : -0.1;
			data.vspeed += dVS;
		}
		if (data.enable[3] && !data.enable[2]) {
			const deltaZ = this.config[3] - data.position.z;
			//if (deltaZ < -5000) config.
		}
		if (data.enable[2] && data.enable[3]) {
			;
		}
		return data;
	}
}

module.exports = Autopilot;
