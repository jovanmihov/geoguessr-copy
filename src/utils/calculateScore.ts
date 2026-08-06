export default function calculateScore(distance: number): number {
  return Math.round(
    1000 / (1 + Math.pow(distance / 30, 2))
  );
}