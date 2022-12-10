import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { useAuth } from "../../context/AuthContext";
import Die from "../Die/Die";
import Button from "../Button/Button";
import { canKeepDie, mergeRollAndKeeps, scoreForKeeps } from "../../utils";
import styles from "./Board.module.scss";

export default function WatchBoard() {
  const { game } = useGame();
  const roll = game?.currentTurn.roll || [];
  const keeps = (game?.currentTurn.keeps || []).flat();
  const score = game?.currentTurn.score || 0;
  const currentPlayerName =
    game?.players.find((player) => game?.currentTurn.player === player.uid)
      ?.name || "Player";

  if (!game) return null;
  return (
    <>
      <div className={styles.board}>
        {roll.map((value, rollIndex) => (
          <Die
            key={`roll-die-${rollIndex}-${value}`}
            value={value}
            disabled={true}
          />
        ))}
      </div>
      <div>
        Roll keeps:
        {keeps.map((value) => (
          <Die key={`keep-die-${value}`} value={value} disabled={true} />
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
