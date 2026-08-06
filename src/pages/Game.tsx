import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./Game.css";
import Map from "../components/Map";
import calculateDistance from "../utils/calculateDistance";
import type { Coordinates } from "../entities/Coordinates";
import { randomCoordinates } from "../utils/randomCoords";
import calculateScore from "../utils/calculateScore";

const TOTAL_ROUNDS = 5;

type RoundResult = { distance: number; score: number };

function saveTopScore(total: number) {
  const stored = localStorage.getItem("topScores");
  const scores: number[] = stored ? JSON.parse(stored) : [0, 0, 0];
  const updated = [...scores, total].sort((a, b) => b - a).slice(0, 3);
  localStorage.setItem("topScores", JSON.stringify(updated));
}

export default function Game() {
  const navigate = useNavigate();
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [targetLocation, setTargetLocation] = useState<Coordinates>(() => randomCoordinates());
  const [result, setResult] = useState<RoundResult | null>(null);

  const isResult = result !== null;
  const isLastRound = round >= TOTAL_ROUNDS;

  function handleSubmitGuess(coords: Coordinates) {
    const km = Number((Math.trunc(calculateDistance(coords, targetLocation)) / 1000).toFixed(2));
    const score = calculateScore(km);
    setResult({ distance: km, score });
    setTotalScore((prev) => prev + score);
  }

  function handleContinue() {
    if (isLastRound) {
      saveTopScore(totalScore);
      navigate("/");
      return;
    }
    setRound((prev) => prev + 1);
    setTargetLocation(randomCoordinates());
    setResult(null);
  }

  return (
    <div className="game">
      <div className="game__hud">
        <Link to="/" className="game__quit">
          ← Quit
        </Link>
        <span className="game__hud-pill">
          Round <strong>{round}</strong> / {TOTAL_ROUNDS}
        </span>
        <span className="game__hud-pill">
          Score <strong>{totalScore}</strong>
        </span>
      </div>

      {!isResult && (
        <div className="game__scene">
          <p className="game__scene-eyebrow">Round {round} of {TOTAL_ROUNDS}</p>
          <h1 className="game__scene-title">Where in Macedonia are you?</h1>
          <p className="game__scene-hint">
            Open the map in the corner, drop your pin, and lock in your guess.
          </p>
        </div>
      )}

      <Map
        key={round}
        targetLocation={targetLocation}
        phase={isResult ? "result" : "guessing"}
        onSubmit={handleSubmitGuess}
      />

      {isResult && result && (
        <div className="game__result" role="dialog" aria-live="polite">
          <p className="game__result-eyebrow">Round {round} of {TOTAL_ROUNDS}</p>
          <p className="game__result-score">
            +{result.score} <span>pts</span>
          </p>
          <p className="game__result-distance">
            You were <strong>{result.distance} km</strong> away
          </p>
          <p className="game__result-total">Total score: {totalScore}</p>
          <button className="game__continue" onClick={handleContinue}>
            {isLastRound ? "Finish & save score" : "Continue →"}
          </button>
        </div>
      )}
    </div>
  );
}
