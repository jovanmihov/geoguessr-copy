import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import type { Coordinates } from "../entities/Coordinates";

type MapProps = {
  submitGuess: (coords: Coordinates) => void;
}

export default function Map({ submitGuess }: MapProps) {
  const MACEDONIA_CENTER: [number, number] = [41.6, 21.72];
  const [guess, setGuess] = useState<Coordinates | null>(null);

  function ClickHandler({ onPick }: { onPick: (coords: Coordinates) => void }) {
    useMapEvents({
      click(e) {
        onPick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      },
    });
    return null;
  }
  
  return (
    <>
      <MapContainer center={MACEDONIA_CENTER} zoom={8} className="game__map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={setGuess} />
        {guess && (
          <Marker position={[guess.latitude, guess.longitude]} />
        )}
      </MapContainer>

      <p className="game__coords">
        {guess
          ? `Selected: ${guess.latitude.toFixed(4)}, ${guess.longitude.toFixed(4)}`
          : "Click on the map to drop a pin."}
      </p>
      {guess && (
        <button className="game__submit" onClick={() => submitGuess(guess)}>
          Submit Guess
        </button>
      )}
    </>
  )

}