function ConvertDDToDMS(d, lng) {
    const dir = d < 0 ? lng ? "W" : "S" : lng ? "E" : "N";
    const deg = 0 | (d < 0 ? d = -d : d);
    const min = 0 | d % 1 * 60;
    const sec = (0 | d * 60 % 1 * 60);
    return `${deg}° ${min.toString().padStart(2, 0)}' ${sec.toString().padStart(2, 0)}" ${dir}`;
}

window.require([
    "esri/Map",
    "esri/Camera",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/geometry/Point",
    "esri/geometry/support/webMercatorUtils",
    "dojo/domReady!"
],
    (
        Map,
        Camera,
        MapView,
        SceneView,
        Point,
        webMercatorUtils
    ) => {
        // Enforce strict mode
        "use strict";

        window.plane = {
            position: {
                x: 12988000,
                y: 4865000,
                z: 3000
            },
            attitude: {
                pitch: 0,
                roll: 0,
                yaw: 0
            },
            speed: 120,
            heading: 270
        };

        const position = new Point({
            ...plane.position,
            spatialReference: {
                wkid: 102100
            }
        });

        // Initialize maps and views
        const main = new Map({
            basemap: "satellite"
        });
        const viewMain = new MapView({
            container: "map",
            map: main,
            zoom: 12,
            rotation: 0,
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
                position,
                tilt: 85
            }
        });
        const viewLeft = new SceneView({
            container: "left-map",
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
                heading: 270,
                position,
                tilt: 80
            }
        });
        const viewRight = new SceneView({
            container: "right-map",
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
                heading: 90,
                position,
                tilt: 80
            }
        });

        viewMain.ui.components = ["compass", "zoom"];
        const coordsWidget = document.createElement("div");
        coordsWidget.id = "coordsWidget";
        coordsWidget.classList.add("esri-widget", "esri-component");
        viewMain.ui.add(coordsWidget, "bottom-right");

        viewForward.ui.components = [];
        viewLeft.ui.components = [];
        viewRight.ui.components = [];

        (function draw() {
            position.x = plane.position.x;
            position.y = plane.position.y;
            position.z = plane.position.z;

            viewMain.center = position;
            viewMain.rotation = -plane.heading;
            viewForward.camera = new Camera({
                heading: plane.heading + plane.attitude.yaw,
                position,
                tilt: 85 + plane.attitude.pitch
            });
            viewLeft.camera = new Camera({
                heading: plane.heading - 90,
                position,
                tilt: 80 + plane.attitude.roll
            });
            viewRight.camera = new Camera({
                heading: plane.heading + 90,
                position,
                tilt: 80 - plane.attitude.roll
            });

            const geographic = webMercatorUtils.webMercatorToGeographic(position);
            document.getElementById("coordsWidget").innerHTML = ConvertDDToDMS(geographic.x, true) + "<br>" + ConvertDDToDMS(geographic.y, false);

            requestAnimationFrame(draw);
        })();
    });
