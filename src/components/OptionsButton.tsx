import { useState } from "react";
import "./OptionsButton.css";
import type { Difficulty } from "../entities/GameOptions";
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTIES,
  MAX_ROUNDS,
  loadGameOptions,
  saveGameOptions,
} from "../utils/gameOptions";

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export default function OptionsButton() {
  const [open, setOpen] = useState(false);
  const [rounds, setRounds] = useState(() => loadGameOptions().rounds);
  const [difficulties, setDifficulties] = useState<Difficulty[]>(
    () => loadGameOptions().difficulties
  );

  function openDialog() {
    const options = loadGameOptions();
    setRounds(options.rounds);
    setDifficulties(options.difficulties);
    setOpen(true);
  }

  function changeRounds(next: number) {
    setRounds(next);
    setDifficulties((prev) =>
      Array.from({ length: next }, (_, index) => prev[index] ?? DEFAULT_DIFFICULTY)
    );
  }

  function setRoundDifficulty(index: number, difficulty: Difficulty) {
    setDifficulties((prev) =>
      prev.map((value, i) => (i === index ? difficulty : value))
    );
  }

  function handleSave() {
    saveGameOptions({ rounds, difficulties });
    setOpen(false);
  }

  return (
    <>
      <button type="button" className="options-button" onClick={openDialog}>
        <span className="options-button__gear" aria-hidden="true">
          ⚙
        </span>
        Options
      </button>

      {open && (
        <div
          className="options-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="options-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="options-card">
            <h2 id="options-title" className="options-card__title">
              Game Options
            </h2>

            <label className="options-card__field">
              <span className="options-card__field-label">Number of rounds</span>
              <select
                className="options-card__select"
                value={rounds}
                onChange={(event) => changeRounds(Number(event.target.value))}
              >
                {Array.from({ length: MAX_ROUNDS }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <div className="options-card__rounds">
              {difficulties.map((difficulty, index) => (
                <div key={index} className="round-row">
                  <span className="round-row__label">Round {index + 1}:</span>
                  <div className="segmented" role="group" aria-label={`Round ${index + 1} difficulty`}>
                    <span
                      className="segmented__indicator"
                      data-level={difficulty}
                      style={{
                        transform: `translateX(${DIFFICULTIES.indexOf(difficulty) * 100}%)`,
                      }}
                    />
                    {DIFFICULTIES.map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`segmented__option${
                          difficulty === level ? " is-active" : ""
                        }`}
                        aria-pressed={difficulty === level}
                        onClick={() => setRoundDifficulty(index, level)}
                      >
                        {DIFFICULTY_LABELS[level]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="options-card__actions">
              <button
                type="button"
                className="options-card__cancel"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="options-card__save"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
