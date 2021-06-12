/*
 * Mimi Chat
 * Created by Shuqiao Zhang in 2018.
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

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { getIdent, flights, flight } from "./crawler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

const { app, server } = new MiServer({
    port,
    static: path.join(__dirname, "build")
});

app.get("/flights/:id/", async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const id = await getIdent(req.params.id);
    const result = await flights(id);
    res.end(result);
});

app.get("/live/*", async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    //const id = await getIdent(req.params.id);
    const result = await flight(req.path);
    res.end(result);
});
