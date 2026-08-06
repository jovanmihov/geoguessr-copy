import { describe, expect, it } from "vitest";
import * as turf from "@turf/turf";
import type { FeatureCollection, Polygon } from "geojson";
import macedoniaData from "./macedonia.json";
import { randomCoordinate } from "./randomCoords";

const macedonia = macedoniaData as FeatureCollection<Polygon>;
const border = macedonia.features[0];

describe("randomCoordinate", () => {
    it("always returns a point inside the North Macedonia border", () => {
        for (let i = 0; i < 10; i++) {
            const { lat, lng } = randomCoordinate();
            console.log(`Random coordinate ${i + 1}: lat=${lat}, lng=${lng}`);
            const inside = turf.booleanPointInPolygon(turf.point([lng, lat]), border);
            expect(inside).toBe(true);
        }
    });
});
