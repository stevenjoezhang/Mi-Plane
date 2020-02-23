var locations = [
	{
		x: 908075,
		y: 5949449,
		z: 1000,
		heading: 90
	},//多瑙河
	{
		x: 9679304,
		y: 3186526,
		z: 8000,
		heading: 0
	},//珠峰
	{
		x: 263139,
		y: 6227069,
		z: 1000,
		heading: 0
	},//巴黎
	{
		x: 12967002,
		y: 4864889,
		z: 2000,
		heading: 270
	},//北大
	{
		x: 779232,
		y: 5780430,
		z: 5000,
		heading: 0
	} //法国与瑞士边界，莱芒湖（日内瓦湖）
]

function applyLocations(data, locat) {
	data.position.x = locat.x;
	data.position.y = locat.y;
	data.position.z = locat.z;
	data.heading = locat.heading;
}

function Controller() {
	this.input = [0, 0, 0, 0, 0];
	this.update = function(deltaT, data) {
		if (!data.enable[1]) {
			data.attitude.roll += this.input[0] / 100 * 10;
			//data.attitude.roll = this.input[0] / 5;
			data.heading += data.attitude.roll / 500;
			//data.heading += data.attitude.roll / 10;
			// 转360度的bug
		}
		if (!data.enable[2]) {
			data.attitude.pitch += this.input[1] / 20 * 10;
			//data.attitude.pitch = this.input[1]
			data.vspeed = Math.tan(data.attitude.pitch * Math.PI / 180) * 28;
			// 还需要计算攻角导致的减速
		}

		if (this.input[2]) {
			data.speed += 0.5;
		}
		if (this.input[3]) {
			data.speed -= 0.5;
		}
		if (data.speed > 250) data.speed = 250;
		if (data.speed < 60) data.speed = 60;
		if (this.input[4]) {
			var locat = locations[Math.floor(Math.random() * locations.length)];
			applyLocations(data, locat);
		}
		return data;
	}
}

module.exports = Controller;
