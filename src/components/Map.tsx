import { useEffect, useState } from "react";
import { AttributionControl, MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Coordinates } from "../entities/Coordinates";

type MapPhase = "guessing" | "result";

type MapProps = {
  targetLocation: Coordinates;
  phase: MapPhase;
  onSubmit: (coords: Coordinates) => void;
};

const targetIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41"><path fill="#e53935" stroke="#7f1d1d" stroke-width="1" d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21 12.5 41 12.5 41S25 21 25 12.5C25 5.6 19.4 0 12.5 0z"/><circle cx="12.5" cy="12.5" r="5" fill="#fff"/></svg>`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const guessIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41"><path fill="#8b5cf6" stroke="#4c1d95" stroke-width="1" d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21 12.5 41 12.5 41S25 21 25 12.5C25 5.6 19.4 0 12.5 0z"/><circle cx="12.5" cy="12.5" r="5" fill="#fff"/></svg>`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);
  return null;
}

function FitToResult({ guess, target }: { guess: Coordinates; target: Coordinates }) {
  const map = useMap();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.fitBounds(
        [
          [guess.latitude, guess.longitude],
          [target.latitude, target.longitude],
        ],
        { padding: [90, 90], maxZoom: 12 },
      );
    }, 380);
    return () => window.clearTimeout(timer);
  }, [map, guess, target]);
  return null;
}

export default function Map({ targetLocation, phase, onSubmit }: MapProps) {
  const MACEDONIA_CENTER: [number, number] = [41.6, 21.72];
  const [guess, setGuess] = useState<Coordinates | null>(null);
  const [expanded, setExpanded] = useState(false);

  const isResult = phase === "result";

  function ClickHandler() {
    useMapEvents({
      click(e) {
        if (isResult) return;
        if (!expanded) {
          setExpanded(true);
          return;
        }
        setGuess({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      },
    });
    return null;
  }

  const dockClass = isResult
    ? "map-dock map-dock--result"
    : expanded
      ? "map-dock map-dock--expanded"
      : "map-dock map-dock--collapsed";

  return (
    <div
      className={dockClass}
      onMouseEnter={() => !isResult && setExpanded(true)}
      onMouseLeave={() => !isResult && setExpanded(false)}
    >
      <div className="map-dock__map-wrap">
        <MapContainer
          center={MACEDONIA_CENTER}
          zoom={7}
          className="map-dock__map"
          attributionControl={false}
          zoomControl={!isResult}
        >
          <AttributionControl prefix={false} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ResizeHandler />
          <ClickHandler />
          {guess && <Marker position={[guess.latitude, guess.longitude]} icon={guessIcon} />}
          {isResult && guess && (
            <>
              <Marker
                position={[targetLocation.latitude, targetLocation.longitude]}
                icon={targetIcon}
              />
              <Polyline
                positions={[
                  [guess.latitude, guess.longitude],
                  [targetLocation.latitude, targetLocation.longitude],
                ]}
                pathOptions={{ color: "#e53935", weight: 3, dashArray: "6 8" }}
              />
              <FitToResult guess={guess} target={targetLocation} />
            </>
          )}
        </MapContainer>
      </div>

      {!isResult && (
        <div className="map-dock__footer">
          <span className="map-dock__hint">
            {guess
              ? `Pin: ${guess.latitude.toFixed(3)}, ${guess.longitude.toFixed(3)}`
              : "Click the map to drop your pin"}
          </span>
          <button
            className="map-dock__submit"
            onClick={() => guess && onSubmit(guess)}
            disabled={!guess}
          >
            Submit Guess
          </button>
        </div>
      )}
    </div>
  );
}
 