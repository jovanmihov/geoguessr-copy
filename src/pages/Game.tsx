import { Link } from "react-router-dom";
import "./Game.css";

export default function Game() {
  return (
    <div className="game">
      <h1 className="game__title">Game Page</h1>
      <Link to="/" className="game__back-link">
        ← Back to Home
      </Link>
    </div>
  )
}
