export type Difficulty = "easy" | "medium" | "hard";

export type GameOptions = {
  rounds: number;
  difficulties: Difficulty[];
};
