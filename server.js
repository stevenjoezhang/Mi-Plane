/*
 * Flight VIS
 * Created by Shuqiao Zhang in 2021.
 * https://zhangshuqiao.org
 */

/*
 * This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 */

import MiServer from "mimi-server";

import path from "path";
import { fileURLToPath } from "url";

import { FlightDataBase } from "./crawler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

const { app, server } = new MiServer({
    port,
    static: path.join(__dirname, "build")
});

app.get("/flights/:id/", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const result = await FlightDataBase.getFlights(req.params.id);
    res.end(JSON.stringify(result));
});

app.get("/live/:flightId/:timestamp", async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const result = await FlightDataBase.getFlight(req.params.flightId, req.params.timestamp);
    res.end(JSON.stringify(result));
});
