import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./Game.css";
import Map from "../components/Map";
import StreetView from "../components/StreetView";
import calculateDistance from "../utils/calculateDistance";
import type { Coordinates } from "../entities/Coordinates";
import { randomCoordinates } from "../utils/randomCoords";
import nearestStreetView from "../utils/nearestStreetView";
import calculateScore from "../utils/calculateScore";

const TOTAL_ROUNDS = 5;

type RoundResult = { distance: number; score: number };

async function findStreetViewLocation(): Promise<Coordinates> {
  for (let attempt = 0; attempt < 60; attempt++) {
    const snapped = await nearestStreetView(randomCoordinates());
    if (snapped) return snapped;
  }
  return randomCoordinates();
}

export default function Game() {
  const navigate = useNavigate();
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [targetLocation, setTargetLocation] = useState<Coordinates | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);

  const isResult = result !== null;
  const isLastRound = round >= TOTAL_ROUNDS;

  useEffect(() => {
    let active = true;
    findStreetViewLocation().then((coords) => {
      if (active) setTargetLocation(coords);
    });
    return () => {
      active = false;
    };
  }, []);

  function saveTopScore(total: number) {
    const stored = localStorage.getItem("topScores");
    const scores: number[] = stored ? JSON.parse(stored) : [0, 0, 0];
    const updated = [...scores, total].sort((a, b) => b - a).slice(0, 3);
    localStorage.setItem("topScores", JSON.stringify(updated));
  }

  function handleSubmitGuess(coords: Coordinates) {
    if (!targetLocation) return;
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
    setResult(null);
    setTargetLocation(null);
    findStreetViewLocation().then(setTargetLocation);
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

      {!targetLocation && (
        <div className="game__loading">
          <div className="game__loading-spinner" />
          <p>Finding a location in Macedonia…</p>
        </div>
      )}

      {targetLocation && (
        <>
          <div className="game__pano">
            <StreetView coords={targetLocation} />
          </div>

          <Map
            key={round}
            targetLocation={targetLocation}
            phase={isResult ? "result" : "guessing"}
            onSubmit={handleSubmitGuess}
          />
        </>
      )}

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
