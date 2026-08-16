import type { Coordinates } from "../entities/Coordinates";

const api = "https://maps.googleapis.com/maps/api/streetview/metadata";

type StreetViewMetadata = {
  status: string;
  location?: { lat: number; lng: number };
};

export default async function nearestStreetView(
  coords: Coordinates,
  radiusMeters = 5000
): Promise<Coordinates | null> {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `${api}?location=${coords.latitude},${coords.longitude}&radius=${radiusMeters}&source=outdoor&key=${key}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data: StreetViewMetadata = await res.json();
  if (data.status !== "OK" || !data.location) return null;

  return { latitude: data.location.lat, longitude: data.location.lng };
}
