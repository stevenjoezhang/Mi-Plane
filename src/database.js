import { draw, Overview } from "./arcgis";

class DataBase {
    constructor(url) {
        this.start = Date.now();
    }

    loadData(data) {
        if (data.time.length < 2) {
            console.warn("Invalid database!");
            return;
        }
        this.data = data;
        this.overview.render(this.data);
        this.echarts(this.data);
    }

    initOverview() {
        this.overview = new Overview();
    }

    autoUpdate() {
        const data = this.query(Date.now() - this.start, true);
        draw({
            ...data,
            attitude: {
                pitch: 0,
                roll: 0,
                yaw: 0
            },
            speed: 120
        });
        requestAnimationFrame(this.autoUpdate.bind(this));
    }

    linearInterpolation(x, [x1, x2], [y1, y2]) {
        return y1 + (x - x1) / (x2 - x1) * (y2 - y1);
    }

    query(t, relative = false) {
        const { time } = this.data;
        if (relative) t += time[0];
        if (t < time[0] || t > time[time.length - 1]) {
            console.warn("Invalid query!");
            return null;
        }
        let index = time.findIndex(item => item >= t);
        if (index !== 0) index--;
        const data = {};
        Object.keys(this.data).forEach(key => {
            let y1 = this.data[key][index];
            let y2 = this.data[key][index + 1];
            if (key === "heading" && Math.abs(y1 - y2) > 180) {
                if (y1 > y2) y2 += 360;
                else y1 += 360;
            }
            data[key] = this.linearInterpolation(t, [time[index], time[index + 1]], [y1, y2]);
        });
        return data;
    }
}

export default DataBase;
