declare global {
  interface Window {
    google?: typeof google;
  }
}

const CALLBACK_NAME = "__onGoogleMapsReady__";

let loaderPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(): Promise<typeof google> {
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<typeof google>((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject(new Error("Missing VITE_GOOGLE_MAPS_API_KEY in your .env.local"));
      return;
    }

    (window as unknown as Record<string, () => void>)[CALLBACK_NAME] = () => {
      if (window.google?.maps) resolve(window.google);
      else reject(new Error("Google Maps loaded but window.google is missing"));
    };

    const params = new URLSearchParams({
      key: apiKey,
      callback: CALLBACK_NAME,
      loading: "async",
      v: "weekly",
    });

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      loaderPromise = null;
      reject(new Error("Failed to load the Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return loaderPromise;
}
