import { useMemo } from "react";
import { shuffledBackgrounds } from "../utils/backgroundImages";
import "./PhotoBackground.css";

/**
 * Full-bleed background of Macedonian landmarks that slide left in a seamless
 * loop. The photo list is shuffled once per mount, then duplicated so the
 * strip wraps without a visible jump.
 */
export default function PhotoBackground() {
  const images = useMemo(() => shuffledBackgrounds(), []);
  const loop = [...images, ...images];

  // ~8s of travel per photo keeps the drift slow regardless of how many there are.
  const duration = `${images.length * 16}s`;

  return (
    <div className="photo-bg" aria-hidden="true">
      <div className="photo-bg__track" style={{ animationDuration: duration }}>
        {loop.map((src, i) => (
          <div className="photo-bg__slide" key={i}>
            <img src={src} alt="" draggable={false} />
          </div>
        ))}
      </div>
      <div className="photo-bg__scrim" />
    </div>
  );
}
