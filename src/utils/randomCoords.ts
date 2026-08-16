import * as turf from "@turf/turf";
import type { FeatureCollection, Polygon } from "geojson";
import macedoniaData from "./macedonia.json";
import type { Coordinates } from "../entities/Coordinates";
import type { Difficulty } from "../entities/GameOptions";
import { EASY_REGIONS, MEDIUM_REGIONS, type Region } from "./regions";

const macedonia = macedoniaData as FeatureCollection<Polygon>;
const bbox = turf.bbox(macedonia);
const border = macedonia.features[0];

export function randomCoordinates(): Coordinates {
    while (true) {
        const point = turf.randomPoint(1, { bbox }).features[0];

        if (turf.booleanPointInPolygon(point, border)) {
            return {
                latitude: point.geometry.coordinates[1],
                longitude: point.geometry.coordinates[0],
            };
        }
    }
}

// A uniform-area random point inside a region's circle, clipped to the border.
// sqrt(random) on the distance keeps the distribution even across the disc
// instead of clustering near the centre. Falls back to the centre if the circle
// lies mostly outside Macedonia (e.g. a lake shore near the border).
function randomPointInRegion(region: Region): Coordinates {
    const origin = turf.point([region.center.longitude, region.center.latitude]);

    for (let attempt = 0; attempt < 40; attempt++) {
        const bearing = Math.random() * 360 - 180;
        const distance = region.radiusKm * Math.sqrt(Math.random());
        const dest = turf.destination(origin, distance, bearing, { units: "kilometers" });

        if (turf.booleanPointInPolygon(dest, border)) {
            return {
                latitude: dest.geometry.coordinates[1],
                longitude: dest.geometry.coordinates[0],
            };
        }
    }

    return region.center;
}

export function randomCoordinatesForDifficulty(difficulty: Difficulty): Coordinates {
    if (difficulty === "hard") return randomCoordinates();

    const regions = difficulty === "easy" ? EASY_REGIONS : MEDIUM_REGIONS;
    const region = regions[Math.floor(Math.random() * regions.length)];
    return randomPointInRegion(region);
}