// Patriotic background photos live in /public/macedonia_images.
// Drop a new file in that folder and add its name here to include it.
const FILES = [
  "270281.jpg",
  "caption.jpg",
  "images (1).jpg",
  "images (2).jpg",
  "images (3).jpg",
  "images.jpg",
  "Kriva_Palanka.JPG",
  "prilep-centar.jpg",
  "resen-parkot-ezerani.jpg",
  "top-pic-Veles_1.jpg",
  "visit-krusevo-macedonia-107.jpg",
];

// encodeURIComponent handles the spaces/parens in the filenames.
export const backgroundImages: string[] = FILES.map(
  (name) => `${import.meta.env.BASE_URL}macedonia_images/${encodeURIComponent(name)}`
);

// Fisher-Yates shuffle so the home page opens on a different photo each visit.
export function shuffledBackgrounds(): string[] {
  const arr = [...backgroundImages];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
