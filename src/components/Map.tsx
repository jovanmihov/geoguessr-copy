import { useState } from "react";
import { AttributionControl, MapContainer, Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Coordinates } from "../entities/Coordinates";

type MapProps = {
  submitGuess: (coords: Coordinates) => void;
  targetLocation: Coordinates;
}

const targetIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41"><path fill="#e53935" stroke="#7f1d1d" stroke-width="1" d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21 12.5 41 12.5 41S25 21 25 12.5C25 5.6 19.4 0 12.5 0z"/><circle cx="12.5" cy="12.5" r="5" fill="#fff"/></svg>`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

export default function Map({ submitGuess, targetLocation }: MapProps) {
  const MACEDONIA_CENTER: [number, number] = [41.6, 21.72];
  const [guess, setGuess] = useState<Coordinates | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function ClickHandler({ onPick }: { onPick: (coords: Coordinates) => void }) {
    useMapEvents({
      click(e) {
        if (submitted) return;
        onPick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      },
    });
    return null;
  }

  function handleSubmit() {
    if (!guess) return;
    setSubmitted(true);
    submitGuess(guess);
  }

  return (
    <>
      <MapContainer center={MACEDONIA_CENTER} zoom={8} className="game__map" attributionControl={false}>
        <AttributionControl prefix={false} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={setGuess} />
        {guess && (
          <Marker position={[guess.latitude, guess.longitude]} />
        )}
        {submitted && guess && (
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
              pathOptions={{ color: "#e53935", weight: 3 }}
            />
          </>
        )}
      </MapContainer>

      <p className="game__coords">
        {guess
          ? `Selected: ${guess.latitude.toFixed(4)}, ${guess.longitude.toFixed(4)}`
          : "Click on the map to drop a pin."}
      </p>
      {guess && !submitted && (
        <button className="game__submit" onClick={handleSubmit}>
          Submit Guess
        </button>
      )}
    </>
  )

}