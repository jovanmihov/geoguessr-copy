import { useMemo, useState } from "react";
import "./TopScores.css";
import type { Score } from "../entities/Score";

function loadTopScores(): Score[] {
  const stored = localStorage.getItem("topScores");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as (Score | number)[];
    return parsed
      .map((entry) =>
        typeof entry === "number" ? { name: "Anonymous", score: entry } : entry
      )
      .sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

export default function TopScores() {
  const [scores] = useState<Score[]>(loadTopScores);
  const [query, setQuery] = useState("");

  const ranked = useMemo(
    () => scores.map((entry, index) => ({ ...entry, rank: index + 1 })),
    [scores]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ranked;
    return ranked.filter((entry) => entry.name.toLowerCase().includes(q));
  }, [ranked, query]);

  return (
    <div className="top-scores">
      <h2 className="top-scores__title">Leaderboard</h2>

      <input
        className="top-scores__search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name…"
        aria-label="Search scores by name"
      />

      {filtered.length === 0 ? (
        <p className="top-scores__empty">
          {scores.length === 0
            ? "No scores yet — play a game to get on the board!"
            : "No players match your search."}
        </p>
      ) : (
        <ol className="top-scores__list">
          {filtered.map((entry) => (
            <li
              key={`${entry.rank}-${entry.name}`}
              className={`top-scores__item top-scores__item--${entry.rank}`}
            >
              <span className="top-scores__rank">{entry.rank}</span>
              <span className="top-scores__name">{entry.name}</span>
              <span className="top-scores__value">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
