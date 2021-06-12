import cheerio from "cheerio";
import { DateTime, Settings } from "luxon";

function parseCoord(ele, index) {
    return parseFloat(getText(ele, index));
}

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
            heading: []
        };

        Settings.defaultZoneName = "utc";
        const ref = DateTime.fromMillis(time[0]).startOf("day");
        let dayOffset = 0;
        let currDay;

        const $ = cheerio.load(tracklog);
        $(".smallrow1, .smallrow2").each((index, ele) => {
            if ($(ele).is(".flight_event_facility, .flight_event")) {
                return;
            }
            const children = $(ele).children();
            const timeString = this.getText(children, 0);
            let day = timeString[2];
            const t = timeString.slice(4);
            if (!currDay) {
                currDay = day;
            } else if (currDay !== day) {
                currDay = day;
                dayOffset++;
            }
            day = ref.plus({ days: dayOffset }).toISODate();
            const ms = DateTime.fromSQL(`${day} ${t}`).toMillis();

            if (time.includes(ms)) {
                this.data.latitude.push(parseFloat(this.getText(children, 1)));
                this.data.longitude.push(parseFloat(this.getText(children, 2)));
                this.data.heading.push(parseInt(children.eq(3).text().match(/\d+/)[0]));
            } else {
                //console.warn("Time not match!", day, time);
            }
            //console.log($(ele).html());
        });
    }

    stringify() {
        return JSON.stringify(this.data);
    }
}

export { DataBase };
