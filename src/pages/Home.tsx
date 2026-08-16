import TopScores from "../components/TopScores";
import StartGameButton from "../components/StartGameButton";
import OptionsButton from "../components/OptionsButton";
import PhotoBackground from "../components/PhotoBackground";
import "./Home.css";

export default function Home() {
  return (
    <>
      <PhotoBackground />
      <div className="home">
      <h1 className="home__title">Welcome to Macedonian GeoGuessr</h1>
      <p className="home__subtitle">
        Guess the location, score points, and climb the leaderboard.
      </p>
      <div className="home__actions">
        <StartGameButton />
        <OptionsButton />
      </div>
      <div className="home__scores">
        <TopScores />
      </div>
      </div>
    </>
  )
}
