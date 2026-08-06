import * as turf from "@turf/turf";
import type { FeatureCollection, Polygon } from "geojson";
import macedoniaData from "./macedonia.json";

const macedonia = macedoniaData as FeatureCollection<Polygon>;
const bbox = turf.bbox(macedonia);
const border = macedonia.features[0];

export function randomCoordinate() {
    while (true) {
        const point = turf.randomPoint(1, { bbox }).features[0];

        if (turf.booleanPointInPolygon(point, border)) {
            return {
                lat: point.geometry.coordinates[1],
                lng: point.geometry.coordinates[0],
            };
        }
    }
}