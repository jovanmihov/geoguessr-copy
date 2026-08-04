import { useNavigate } from "react-router-dom";
import "./StartGameButton.css";

export default function StartGameButton() {
  const navigate = useNavigate();

  function handleStartGame() {
    navigate("/game");
  }

  return (
    <button className="start-game-button" onClick={handleStartGame}>
      Start Game
    </button>
  )
}