import TopScores from "../components/TopScores";
import StartGameButton from "../components/StartGameButton";
import heroImage from "../assets/hero.png";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <img src={heroImage} alt="" className="home__hero-image" />
      <h1 className="home__title">Welcome to Macedonian GeoGuessr</h1>
      <p className="home__subtitle">
        Guess the location, score points, and climb the leaderboard.
      </p>
      <StartGameButton />
      <div className="home__scores">
        <TopScores />
      </div>
    </div>
  )
}
