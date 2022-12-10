import { useGame } from "../../context/GameContext";
import Die from "../Die/Die";
import styles from "./Board.module.scss";

export default function WatchBoard() {
  const { game } = useGame();
  const roll = game?.currentTurn.roll;
  const keeps = [
    ...(game?.currentTurn?.rollKeeps || []),
    ...(game?.currentTurn.roundKeeps || []).flat(),
  ];

  const currentPlayerName =
    game?.players?.find((player) => game?.currentTurn.player === player.uid)
      ?.name || "Player";

  if (!game) return null;
  return (
    <>
      <div className={styles.board}>
        {roll?.map((value, rollIndex) => (
          <Die
            key={`roll-die-${rollIndex}-${value}`}
            value={value}
            disabled={true}
          />
        ))}
      </div>
      <div>
        Roll keeps:
        {keeps?.map((value, keepsIndex) => (
          <Die
            key={`keep-die-${keepsIndex}-${value}`}
            value={value}
            disabled={true}
          />
        ))}
      </div>
      <p>Score: {game?.currentTurn.score}</p>
      {game?.currentTurn.status === "BUSTED" && (
        <div>
          <h1>{currentPlayerName} Busted!</h1>
        </div>
      )}
    </>
  );
}
