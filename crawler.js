import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import { DataBase } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
