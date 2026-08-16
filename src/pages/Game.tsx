import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./Game.css";
import Map from "../components/Map";
import StreetView from "../components/StreetView";
import calculateDistance from "../utils/calculateDistance";
import type { Coordinates } from "../entities/Coordinates";
import { randomCoordinatesForDifficulty } from "../utils/randomCoords";
import nearestStreetView from "../utils/nearestStreetView";
import calculateScore from "../utils/calculateScore";
import type { Score } from "../entities/Score";
import type { Difficulty } from "../entities/GameOptions";
import { loadGameOptions } from "../utils/gameOptions";

type RoundResult = { distance: number; score: number };

// Tighter tiers snap closer so an "easy" city-centre round can't drift out onto
// a ring road; "hard" searches wide because rural coverage is sparse.
const SNAP_RADIUS_METERS: Record<Difficulty, number> = {
  easy: 100,
  medium: 1000,
  hard: 10000,
};

// Skopje's Macedonia Square — always has imagery, used only as a last resort.
const FALLBACK_LOCATION: Coordinates = { latitude: 41.9965, longitude: 21.4314 };

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

function loadStoredScores(): Score[] {
  const stored = localStorage.getItem("topScores");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as (Score | number)[];
    return parsed.map((entry) =>
      typeof entry === "number" ? { name: "Anonymous", score: entry } : entry
    );
  } catch {
    return [];
  }
}

async function findStreetViewLocation(difficulty: Difficulty): Promise<Coordinates> {
  const radius = SNAP_RADIUS_METERS[difficulty];
  for (let attempt = 0; attempt < 60; attempt++) {
    const snapped = await nearestStreetView(
      randomCoordinatesForDifficulty(difficulty),
      radius
    );
    if (snapped) return snapped;
  }
  // Never hand StreetView an un-snapped point (it would render a blank pano).
  const fallback = await nearestStreetView(FALLBACK_LOCATION, 10000);
  return fallback ?? FALLBACK_LOCATION;
}

export default function Game() {
  const navigate = useNavigate();
  const [options] = useState(loadGameOptions);
  const totalRounds = options.rounds;
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [targetLocation, setTargetLocation] = useState<Coordinates | null>(null);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const isResult = result !== null;
  const isLastRound = round >= totalRounds;
  const currentDifficulty = options.difficulties[round - 1];

  useEffect(() => {
    let active = true;
    findStreetViewLocation(options.difficulties[0]).then((coords) => {
      if (active) setTargetLocation(coords);
    });
    return () => {
      active = false;
    };
  }, [options]);

  function saveTopScore(name: string, total: number) {
    const scores = loadStoredScores();
    const updated = [...scores, { name, score: total }].sort(
      (a, b) => b.score - a.score
    );
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
      setShowNameDialog(true);
      return;
    }
    const nextRound = round + 1;
    setRound(nextRound);
    setResult(null);
    setTargetLocation(null);
    findStreetViewLocation(options.difficulties[nextRound - 1]).then(setTargetLocation);
  }

  function handleSaveScore(event: FormEvent) {
    event.preventDefault();
    saveTopScore(playerName.trim() || "Anonymous", totalScore);
    navigate("/");
  }

  return (
    <div className="game">
      <div className="game__hud">
        <Link to="/" className="game__quit">
          ← Quit
        </Link>
        <span className="game__hud-pill">
          Round <strong>{round}</strong> / {totalRounds}
        </span>
        <span className="game__hud-pill">
          <strong>{DIFFICULTY_LABELS[currentDifficulty]}</strong>
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

      {isResult && result && !showNameDialog && (
        <div className="game__result" role="dialog" aria-live="polite">
          <p className="game__result-eyebrow">Round {round} of {totalRounds}</p>
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

      {showNameDialog && (
        <div
          className="game__overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-over-title"
        >
          <form className="game__namecard" onSubmit={handleSaveScore}>
            <p className="game__namecard-eyebrow">Game over</p>
            <h2 id="game-over-title" className="game__namecard-title">
              Final score
            </h2>
            <p className="game__namecard-score">
              {totalScore} <span>pts</span>
            </p>
            <label className="game__namecard-label" htmlFor="player-name">
              Enter your name for the leaderboard
            </label>
            <input
              id="player-name"
              className="game__namecard-input"
              type="text"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Your name"
              maxLength={20}
              autoFocus
            />
            <button type="submit" className="game__continue">
              Save score →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
