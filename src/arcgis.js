import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import { ConvertDDToDMS, cameraCoord } from "./utils";
import glb from "./assets/plane.glb";

const position = {
    longitude: 116.3037,
    latitude: 39.9934,
    z: 3000
};

// Initialize maps and views
const main = new Map({
    basemap: "satellite"
});
const viewMain = new MapView({
    container: "map",
    map: main,
    zoom: 12,
    center: position
});

const map = new Map({
    basemap: "satellite",
    ground: "world-elevation"
});
const viewForward = new SceneView({
    container: "forward-map",
    map,
    environment: {
        lighting: {
            date: Date.now(),
            directShadowsEnabled: true,
            ambientOcclusionEnabled: true
        },
        atmosphere: {
            quality: "high"
        }
    },
    camera: {
        heading: 0,
        position: cameraCoord(position, 0, 200),
        tilt: 85
    }
});

viewMain.ui.components = ["compass", "zoom"];
const coordsWidget = document.createElement("div");
coordsWidget.id = "coordsWidget";
coordsWidget.classList.add("esri-widget", "esri-component");
viewMain.ui.add(coordsWidget, "bottom-right");
const planeWidget = document.createElement("div");
planeWidget.id = "plane";
viewMain.ui.add(planeWidget, "manual");

viewForward.ui.components = [];

let mouseX = viewForward.width / 2;
let lastX = viewForward.width / 2;
viewForward.on("resize", function(event) {
    mouseX = event.width / 2;
    lastX = event.width / 2;
});
viewForward.on("pointer-down", function(event) {
    lastX = event.x;
});
viewForward.on("drag", function(event) {
    mouseX = Math.max(Math.min(mouseX + event.x - lastX, viewForward.width), 0);
    lastX = event.x;
    event.stopPropagation();
});

// https://developers.arcgis.com/javascript/latest/sample-code/import-gltf/
const graphic = new Graphic({
    geometry: {
        type: "point",
        ...position
    },
    symbol: {
        type: "point-3d",
        symbolLayers: [{
            type: "object",
            height: 10,
            heading: 180,
            resource: {
                href: glb
            }
        }]
    }
});
const graphicsLayer = new GraphicsLayer();

map.add(graphicsLayer);
graphicsLayer.add(graphic);

function draw(plane) {
    const time = new Date(plane.time);
    position.longitude = plane.longitude;
    position.latitude = plane.latitude;
    position.z = plane.altitude;

    viewMain.center = position;
    viewMain.rotation = -plane.heading;

    graphic.geometry = {
        type: "point",
        ...position
    };
    graphic.symbol = {
        type: "point-3d",
        symbolLayers: [{
            type: "object",
            height: 10,
            heading: plane.heading + plane.attitude.yaw + 180,
            tilt: -plane.attitude.pitch,
            resource: {
                href: glb
            }
        }]
    };

    const heading = plane.heading + mouseX / viewForward.width * 180 - 90;
    viewForward.camera = {
        heading,
        position: cameraCoord(position, heading, 200),
        tilt: 85
    };
    viewForward.environment.lighting.date = time;

    document.getElementById("coordsWidget").innerHTML = ConvertDDToDMS(position.longitude, true) + "<br>" + ConvertDDToDMS(position.latitude, false);
};

class Overview {
    constructor() {
        this.map = new Map({
            basemap: "topo-vector",
            ground: "world-elevation"
        });

        this.graphicsLayer = new GraphicsLayer();
        this.map.add(this.graphicsLayer);
        main.add(this.graphicsLayer);

        this.view = new SceneView({
            container: "overview-map",
            map: this.map,
            scale: 50000000,
            center: [-101.17, 21.78]
        });
        this.view.ui.components = ["zoom", "navigation-toggle", "compass"];
    }

    render(data) {
        const { latitude, longitude, altitude, length } = data;
        const paths = [];
        let x = 0;
        let y = 0;
        for (let i in latitude) {
            paths.push([longitude[i], latitude[i], altitude[i]]);
            x += longitude[i];
            y += latitude[i];
        }
        this.view.center = [x / length, y / length];

        const polylineGraphic = new Graphic({
            geometry: {
                type: "polyline", // autocasts as new Polyline()
                paths
            },
            symbol: {
                type: "simple-line", // autocasts as SimpleLineSymbol()
                color: [226, 119, 40],
                width: 4
            }
        });

        this.graphicsLayer.removeAll();
        this.graphicsLayer.add(polylineGraphic);
    }
}

export { draw, Overview };
