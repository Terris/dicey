import { useGame } from "../../context/GameContext";
import { Player } from "../../types/types";
import { FaDice } from "react-icons/fa";
import styles from "./PlayerScores.module.scss";
export default function PlayerScores() {
  const { game } = useGame();

  if (!game || game.status !== "IN_PROGRESS") return null;
  return (
    <div className={styles["player-scores"]}>
      <p style={{ fontWeight: 700, paddingBottom: "6px" }}>Score Board</p>
      {game.players.map((player: Player) => (
        <div key={player.uid}>
          <p className={styles["player-score"]}>
            <span>
              {game.currentTurn.player === player.uid && (
                <FaDice style={{ marginRight: "5px", color: "#d07650" }} />
              )}
              {player.name}
              {game.owner === player.uid && "*"}
            </span>
            <span>{player.score}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
