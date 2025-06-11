import * as cheerio from "cheerio";

class DataBase {
    constructor(json) {
        try {
            const tracklog = JSON.parse(json);
            this.fromJSON(tracklog);
        } catch (e) {
            console.warn(e);
            this.data = {};
        }
    }

    fromJSON(tracklog) {
        const { track } = tracklog.result.response.data.flight;
        const start = track[0].timestamp * 1000; // Convert to milliseconds
        const time = track.map(t => t.timestamp * 1000 - start); // Convert to milliseconds
        const altitude = track.map(t => t.altitude.meters);
        const speed = track.map(t => t.speed.kmh);
        const latitude = track.map(t => t.latitude);
        const longitude = track.map(t => t.longitude);
        const heading = track.map(t => t.heading);
        const length = track.length;
        this.data = {
            start,
            time,
            altitude,
            speed,
            latitude,
            longitude,
            heading,
            length
        };
    }

    stringify() {
        return JSON.stringify(this.data);
    }
}

async function request(url) {
    console.log("REQ", url);
    const res = await fetch(url);
    return res.text();
}

async function flights(number) {
    const html = await request(`https://www.flightradar24.com/data/flights/${number}`);
    const result = [];
    const $ = cheerio.load(html);
    $("tr.data-row").each((index, ele) => {
        const a = $(ele).find("a.btn-playback");
        if ($(a).attr("class").includes("disabled")) {
            return;
        }
        const tds = $(ele).find("td");
        const origin = tds.eq(3).text().split("\n")[1].trim();
        const destination = tds.eq(4).text().split("\n")[1].trim();
        const aircraftTypeFriendly = tds.eq(5).text().split("\n")[1].trim();
        const ete = tds.eq(6).text().trim();
        const departure = tds.eq(7).attr("data-timestamp");
        const actual = tds.eq(8).attr("data-timestamp");
        const landingTimes = tds.eq(9).attr("data-timestamp");
        const flightId = $(a).attr("data-flight-hex");
        const timestamp = $(ele).attr("data-timestamp");
        const trackLog = `/live/${flightId}/${timestamp}`;
        result.push({
            origin,
            destination,
            aircraftTypeFriendly,
            ete,
            departure: parseInt(departure, 10),
            actual: parseInt(actual, 10),
            landingTimes: parseInt(landingTimes, 10),
            flightId,
            timestamp,
            trackLog
        });
    });
    return result;
}

async function flight(flightId, timestamp) {
    const json = await request(`https://api.flightradar24.com/common/v1/flight-playback.json?flightId=${flightId}&timestamp=${timestamp}`);
    const db = new DataBase(json);
    return db.stringify();
}

export { flights, flight };
