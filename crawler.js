import https from "https";
import cheerio from "cheerio";

class DataBase {
    constructor(tracklog) {
        this.fromTracklog(tracklog);
    }

    getText(ele, index) {
        return ele.eq(index).children(".show-for-medium-up").text();
    }

    fromTracklog(tracklog) {
        let [all, altitude, speed] = tracklog.match(/altitude_json = (.*?); speed_json = (.*?); facility_json/);
        altitude = JSON.parse(altitude);
        speed = JSON.parse(speed);

        const time = altitude.map(alt => alt[0]);
        altitude = altitude.map(alt => alt[1]);
        speed = speed.map(spd => spd[1]);
        this.data = {
            time,
            altitude,
            speed,
            latitude: [],
            longitude: [],
            heading: [],
            length: 0
        };

        const $ = cheerio.load(tracklog);
        $(".smallrow1, .smallrow2").each((index, ele) => {
            if (this.data.length === time.length || $(ele).is(".flight_event_facility, .flight_event")) {
                return;
            }
            const children = $(ele).children();
            this.data.latitude.push(parseFloat(this.getText(children, 1)));
            this.data.longitude.push(parseFloat(this.getText(children, 2)));
            this.data.heading.push(parseInt(children.eq(3).text().match(/\d+/)[0]));
            this.data.length++;
        });
    }

    stringify() {
        return JSON.stringify(this.data);
    }
}

async function request(url) {
    console.log("REQ", url);
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            const chunks = [];
            res.on("data", data => {
                chunks.push(data);
            });
            res.on("end", () => {
                resolve(chunks.join(""));
            });
        }).on("error", err => {
            reject("Error with http(s) request: " + err);
        });
    });
}

async function getIdent(id) {
    const result = await request(`https://e1.flightcdn.com/ajax/ignoreall/omnisearch/flight.rvt?searchterm=${id}`);
    return JSON.parse(result).data[0]?.ident || id;
}

async function flights(number) {
    const html = await request(`https://zh.flightaware.com/live/flight/${number}`);
    const result = html.match(/<script>var trackpollBootstrap = (\{.*?\});<\/script>/)[1];
    return result;
}

async function flight(path) {
    const html = await request(`https://zh.flightaware.com${path}`);
    const db = new DataBase(html);
    return db.stringify();
}

export { getIdent, flights, flight };
