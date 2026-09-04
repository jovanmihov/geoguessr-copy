import { describe, expect, it } from "vitest";
import * as turf from "@turf/turf";
import type { FeatureCollection, Polygon } from "geojson";
import macedoniaData from "./macedonia.json";
import { randomCoordinates, randomCoordinatesForDifficulty } from "./randomCoords";
import { EASY_REGIONS, MEDIUM_REGIONS } from "./regions";

const macedonia = macedoniaData as FeatureCollection<Polygon>;
const border = macedonia.features[0];

function isInside({ latitude, longitude }: { latitude: number; longitude: number }) {
    return turf.booleanPointInPolygon(turf.point([longitude, latitude]), border);
}

describe("randomCoordinates", () => {
    it("always returns a point inside the North Macedonia border", () => {
        for (let i = 0; i < 20; i++) {
            expect(isInside(randomCoordinates())).toBe(true);
        }
    });
});

// A region's fallback (when its circle is clipped away by the border) is its own
// centre, so every centre must itself be inside the polygon — otherwise that
// region can hand back an out-of-country point. Checking this deterministically
// catches border-town data errors that random sampling would only surface
// intermittently.
describe("difficulty region centers", () => {
    it.each([
        ["easy", EASY_REGIONS],
        ["medium", MEDIUM_REGIONS],
    ] as const)("all %s region centers are inside the border", (_label, regions) => {
        for (const region of regions) {
            expect(isInside(region.center), region.name).toBe(true);
        }
    });
});

describe("randomCoordinatesForDifficulty", () => {
    it.each(["easy", "medium", "hard"] as const)(
        "stays inside the border for %s",
        (difficulty) => {
            for (let i = 0; i < 20; i++) {
                expect(isInside(randomCoordinatesForDifficulty(difficulty).coordinates)).toBe(true);
            }
        }
    );

    it.each(["easy", "medium"] as const)(
        "never returns an excluded region name for %s",
        (difficulty) => {
            const regions = difficulty === "easy" ? EASY_REGIONS : MEDIUM_REGIONS;
            const keep = regions[0].name;
            const excluded = new Set(regions.map((r) => r.name).filter((name) => name !== keep));

            for (let i = 0; i < 10; i++) {
                const { regionName } = randomCoordinatesForDifficulty(difficulty, excluded);
                expect(regionName).toBe(keep);
            }
        }
    );

    it("falls back to repeats once every region in a difficulty is excluded", () => {
        const excluded = new Set(EASY_REGIONS.map((r) => r.name));
        const { coordinates, regionName } = randomCoordinatesForDifficulty("easy", excluded);
        expect(regionName).not.toBeNull();
        expect(isInside(coordinates)).toBe(true);
    });

    it("ignores exclusions for hard, which has no named regions", () => {
        const { regionName } = randomCoordinatesForDifficulty("hard", new Set(["anything"]));
        expect(regionName).toBeNull();
    });
});
