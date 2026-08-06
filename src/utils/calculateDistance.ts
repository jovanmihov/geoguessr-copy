export default function calculateScore(guess: { latitude: number; longitude: number }, actual: { latitude: number; longitude: number }): number {
  const R = 6371000;

  const toRad = (deg: number) => deg * Math.PI / 180;

  const dLat = toRad(actual.latitude - guess.latitude);
  const dLon = toRad(actual.longitude - guess.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(guess.latitude)) *
      Math.cos(toRad(actual.latitude)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}