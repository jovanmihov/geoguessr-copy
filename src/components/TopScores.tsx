import { useState } from "react";
import "./TopScores.css";

export default function TopScores() {
  const [topScores] = useState<number[]>(() => {
    const scores = localStorage.getItem("topScores");
    return scores ? JSON.parse(scores) : [0, 0, 0];
  });

  return (
    <div className="top-scores">
      <h2 className="top-scores__title">Your Top Scores</h2>
      <ol className="top-scores__list">
        {topScores.map((score, index) => (
          <li key={index} className={`top-scores__item top-scores__item--${index + 1}`}>
            <span className="top-scores__rank">{index + 1}</span>
            <span className="top-scores__value">{score}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
