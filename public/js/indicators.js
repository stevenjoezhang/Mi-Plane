const indicator = {};

indicator.airspeed = $.flightIndicator("#airspeed", "airspeed");
indicator.attitude = $.flightIndicator("#attitude", "attitude", { roll: 50, pitch: -20 });
indicator.altimeter = $.flightIndicator("#altimeter", "altimeter");
indicator.turn_coordinator = $.flightIndicator("#turn_coordinator", "turn_coordinator", { turn: 0 });
indicator.heading = $.flightIndicator("#heading", "heading", { heading: 150 });
indicator.variometer = $.flightIndicator("#variometer", "variometer", { vario: -5 });

for (const ins in indicator) {
	indicator[ins].resize("33vw");
}

const protocol = location.protocol.replace("http", "ws");
new WebSocketController(`${protocol}//${location.host}`, event => {
	const plane = JSON.parse(event.data);
	// Airspeed update
	indicator.airspeed.setAirSpeed(plane.speed * 1.943844);
	// Attitude update
	indicator.attitude.setRoll(-plane.attitude.roll);
	indicator.attitude.setPitch(plane.attitude.pitch);
	// Altimeter update
	indicator.altimeter.setAltitude(plane.position.z / 0.3048);
	indicator.altimeter.setPressure(Math.pow((1 - plane.position.z / 44300), 5.256) * 1013.25);
	// TC update
	indicator.turn_coordinator.setTurn(0);
	// Heading update
	indicator.heading.setHeading(plane.heading);
	// Vario update
	indicator.variometer.setVario(plane.vspeed * 60 / 304.8);
});
