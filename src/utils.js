function ConvertDDToDMS(d, lng) {
    const dir = d < 0 ? lng ? "W" : "S" : lng ? "E" : "N";
    const deg = 0 | (d < 0 ? d = -d : d);
    const min = 0 | d % 1 * 60;
    const sec = (0 | d * 60 % 1 * 60);
    return `${deg}° ${min.toString().padStart(2, 0)}' ${sec.toString().padStart(2, 0)}" ${dir}`;
}

function ConvertMSToHHMM(ms) {
    const minutes = parseInt(ms / 1000 / 60);
    if (minutes < 60) return minutes + "分";
    return parseInt(minutes / 60) + "小时" + minutes % 60 + "分";
}

function cameraCoord({ longitude, latitude, z }, heading, distance) {
    const radius = 6378000;
    const deg2rad = Math.PI / 180;
    const deltaX = distance * Math.sin(heading * deg2rad);
    const deltaY = distance * Math.cos(heading * deg2rad);
    const X = longitude - deltaX / Math.cos(latitude * deg2rad) / radius / deg2rad;
    const Y = latitude - deltaY / radius / deg2rad;
    return {
        longitude: X,
        latitude: Y,
        z: z + 10
    };
}

export { ConvertDDToDMS, ConvertMSToHHMM, cameraCoord };
