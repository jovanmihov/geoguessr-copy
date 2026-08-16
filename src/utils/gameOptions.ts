import type { Difficulty, GameOptions } from "../entities/GameOptions";

export const MAX_ROUNDS = 5;
export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
export const DEFAULT_DIFFICULTY: Difficulty = "medium";

const STORAGE_KEY = "gameOptions";

function clampRounds(rounds: number): number {
  if (!Number.isFinite(rounds)) return MAX_ROUNDS;
  return Math.min(Math.max(Math.round(rounds), 1), MAX_ROUNDS);
}

function normalizeDifficulties(
  rounds: number,
  difficulties: Difficulty[]
): Difficulty[] {
  return Array.from({ length: rounds }, (_, index) => {
    const value = difficulties[index];
    return DIFFICULTIES.includes(value) ? value : DEFAULT_DIFFICULTY;
  });
}

export function loadGameOptions(): GameOptions {
  const stored = localStorage.getItem(STORAGE_KEY);
  let rounds = MAX_ROUNDS;
  let difficulties: Difficulty[] = [];

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<GameOptions>;
      if (typeof parsed.rounds === "number") rounds = parsed.rounds;
      if (Array.isArray(parsed.difficulties)) difficulties = parsed.difficulties;
    } catch {
      // fall back to defaults on malformed data
    }
  }

  rounds = clampRounds(rounds);
  return { rounds, difficulties: normalizeDifficulties(rounds, difficulties) };
}

export function saveGameOptions(options: GameOptions): void {
  const rounds = clampRounds(options.rounds);
  const difficulties = normalizeDifficulties(rounds, options.difficulties);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ rounds, difficulties }));
}
