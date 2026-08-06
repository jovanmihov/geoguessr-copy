import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./Game.css";
import Map from "../components/Map";

export default function Game() {
  function handleSubmitGuess(coords: { latitude: number; longitude: number }) {
    console.log("Submitted guess:", coords);
  }

  return (
    <div className="game">
      <h1 className="game__title">Game Page</h1>
      <Link to="/" className="game__back-link">
        ← Back to Home
      </Link>
      <Map submitGuess={handleSubmitGuess} />
    </div>
  );
}
