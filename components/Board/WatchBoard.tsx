import { useGame } from "../../context/GameContext";
import Die from "../Die/Die";
import styles from "./Board.module.scss";

export default function WatchBoard() {
  const { game } = useGame();
  const roll = game?.currentTurn.roll;

  const currentPlayerName =
    game?.players?.find((player) => game?.currentTurn.player === player.uid)
      ?.name || "Player";

  if (!game) return null;
  return (
    <div className={styles.board}>
      <div className={styles["roll-area"]}>
        {roll?.map((value, rollIndex) => (
          <Die
            key={`roll-die-${rollIndex}-${value}`}
            value={value}
            disabled={true}
          />
        ))}
      </div>
      <div className={styles["keep-area"]}>
        <div className={styles["keep-area-rollkeeps"]}>
          {game.currentTurn.rollKeeps?.map((value, keepsIndex) => (
            <Die
              key={`keep-die-${keepsIndex}-${value}`}
              value={value}
              disabled={true}
            />
          ))}
        </div>
        <div className={styles["keep-area-turnkeeps"]}>
          {game.currentTurn.roundKeeps?.map((keepGroup) =>
            keepGroup.map((val, idx) => (
              <Die key={`keep-die-${idx}-${val}`} value={val} />
            ))
          )}
        </div>
      </div>
      <p>Score: {game?.currentTurn.score}</p>
      {game?.currentTurn.status === "BUSTED" && (
        <div>
          <h1>{currentPlayerName} Busted!</h1>
        </div>
      )}
    </div>
  );
}
