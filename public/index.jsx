class DataBase {
    constructor(url) {
        ;
    }

    async loadData() {
        const response = await fetch("/flights/3U8834/");
        this.data = await response.json();
    }

    linearInterpolation(x, [x1, x2], [y1, y2]) {
        return y1 + (x - x1) / (x2 - x1) * (y2 - y1);
    }

    query(t) {
        const { time } = this.data;
        if (time.length < 2) {
            console.warn("Invalid database!");
            return null;
        }
        if (t < time[0] || t > time[time.length - 1]) {
            console.warn("Invalid query!");
            return null;
        }
        let index = time.findIndex(item => item >= t);
        if (index === time.length - 1) index--;
        const data = {};
        Object.keys(this.data).forEach(key => {
            data[key] = this.linearInterpolation(t, [time[index], time[index + 1]], [this.data[key][index], this.data[key][index + 1]]);
        });
        return data;
    }
}

fetch("/flights/3U8834/")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        ReactDOM.render(
            Object.values(data.flights)[0].activityLog.flights.map(row => (<tr key={row.flightId}>
                <td><a href={row.links.trackLog}>{new Date(row.flightPlan.departure * 1e3).toLocaleString()}</a></td>
                <td>{new Date(row.takeoffTimes.actual * 1e3).toTimeString() + row.origin.friendlyName}</td>
                <td>{new Date(row.landingTimes.actual * 1e3).toTimeString() + row.destination.friendlyName}</td>
                <td>{row.aircraftTypeFriendly}</td>
                <td>{row.flightPlan.ete / 60 + "分"}</td>
            </tr>)),
            document.getElementById("table-body")
        );
    });
