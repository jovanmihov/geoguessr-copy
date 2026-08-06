import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./Game.css";
import Map from "../components/Map";
import calculateDistance from "../utils/calculateDistance";
import type { Coordinates } from "../entities/Coordinates";
import { randomCoordinates } from "../utils/randomCoords";

const SKOPJE = {latitude: 41.9921, longitude: 21.4234};

export default function Game() {
  const [targetLocation, setTargetLocation] = useState<Coordinates>(SKOPJE);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    setTargetLocation(randomCoordinates())
  }, [])

  function handleSubmitGuess(coords: { latitude: number; longitude: number }) {
    const km = Number((Math.trunc(calculateDistance(coords, targetLocation))/1000).toFixed(2));
    setDistance(km);
    console.log(`Distance: ${km} km`);
  }

  return (
    <div className="game">
      <h1 className="game__title">Game Page</h1>
      <Link to="/" className="game__back-link">
        ← Back to Home
      </Link>
      <Map submitGuess={handleSubmitGuess} targetLocation={targetLocation} />
      {distance !== null && <p>Distance: {distance} km</p>}
    </div>
  );
}
