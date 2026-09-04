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

export type DifficultyLocation = {
    coordinates: Coordinates;
    regionName: string | null;
};

// excludeNames lets a caller keep a location's named region (e.g. "Struga") from
// repeating within a run. "hard" has no named regions, so it's exempt. If every
// region in a difficulty has already been visited, repeats are allowed again
// rather than narrowing the pool to nothing.
export function randomCoordinatesForDifficulty(
    difficulty: Difficulty,
    excludeNames: ReadonlySet<string> = new Set()
): DifficultyLocation {
    if (difficulty === "hard") return { coordinates: randomCoordinates(), regionName: null };

    const regions = difficulty === "easy" ? EASY_REGIONS : MEDIUM_REGIONS;
    const unvisited = regions.filter((region) => !excludeNames.has(region.name));
    const pool = unvisited.length > 0 ? unvisited : regions;
    const region = pool[Math.floor(Math.random() * pool.length)];

    return { coordinates: randomPointInRegion(region), regionName: region.name };
}