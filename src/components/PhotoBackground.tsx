import { useEffect, useMemo, useState } from "react";
import { shuffledBackgrounds } from "../utils/backgroundImages";
import "./PhotoBackground.css";

// How long each photo stays fully visible before crossfading to the next.
const HOLD_MS = 6000;

/**
 * Full-bleed background of Macedonian landmarks that crossfade one into the
 * next. The photo list is shuffled once per mount; a timer advances the active
 * index and CSS opacity transitions handle the fade.
 */
export default function PhotoBackground() {
  const images = useMemo(() => shuffledBackgrounds(), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    // Reduced-motion users hold on a single photo — no auto-advance, no fade.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="photo-bg" aria-hidden="true">
      {images.map((src, i) => (
        <img
          key={src}
          className={"photo-bg__slide" + (i === index ? " is-active" : "")}
          src={src}
          alt=""
          draggable={false}
        />
      ))}
      <div className="photo-bg__scrim" />
    </div>
  );
}
