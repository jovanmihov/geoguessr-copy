import { useEffect, useRef } from "react";
import type { Coordinates } from "../entities/Coordinates";
import { loadGoogleMaps } from "../utils/loadGoogleMaps";

const SEARCH_RADIUS_METERS = 5000;

export default function StreetView({ coords }: { coords: Coordinates }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then((google) => {
        if (cancelled || !containerRef.current) return;

        const location = { lat: coords.latitude, lng: coords.longitude };

        const panorama =
          panoramaRef.current ??
          new google.maps.StreetViewPanorama(containerRef.current, {
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            clickToGo: true,
            scrollwheel: true,
            linksControl: true,
            panControl: true,
            showRoadLabels: false,
            addressControl: false,
            fullscreenControl: false,
            motionTrackingControl: false,
          });
        panoramaRef.current = panorama;

        const service = new google.maps.StreetViewService();
        service.getPanorama(
          {
            location,
            radius: SEARCH_RADIUS_METERS,
            source: google.maps.StreetViewSource.OUTDOOR,
          },
          (data, status) => {
            if (cancelled) return;
            if (status === google.maps.StreetViewStatus.OK && data?.location?.pano) {
              panorama.setPano(data.location.pano);
              panorama.setPov({ heading: 165, pitch: 0 });
              panorama.setVisible(true);
            } else {
              panorama.setVisible(false);
              console.warn("No Street View imagery near", location, "-", status);
            }
          },
        );
      })
      .catch((error) => console.error("Street View failed to load:", error));

    return () => {
      cancelled = true;
    };
  }, [coords]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
