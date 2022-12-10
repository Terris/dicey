import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { useAuth } from "../../context/AuthContext";
import Die from "../../components/Die/Die";
import Button from "../../components/Button/Button";
import { canKeepDie, mergeRollAndKeeps, scoreForKeeps } from "../../utils";
import styles from "./Board.module.scss";

export default function Board() {
  const { user } = useAuth();
  const { game, turn, rollDice, addRollKeep, removeRollKeep, stay } = useGame();

  // Show toast on current users turn
  useEffect(() => {
    if (!game) return;
    if (game.currentTurn.player === user?.uid && !turn.roll.length) {
      toast.success("Your turn!", { duration: 4000 });
    }
  }, [game, user?.uid, turn.roll.length]);

  const playerCanStay = turn.rollKeeps.length > 0;

  return (
    <>
      <div className={styles.board}>
        {turn.roll.map((value, rollIndex) => (
          <Die
            key={`roll-die-${rollIndex}-${value}`}
            value={value}
            onClick={() => addRollKeep({ value, rollIndex })}
            disabled={
              !canKeepDie({
                roll: mergeRollAndKeeps(turn.roll, turn.rollKeeps),
                die: value,
              })
            }
          />
        ))}
      </div>
      <div>
        Roll keeps:
        {turn.rollKeeps.map((value, rollKeepsIndex) => (
          <Die
            key={`keep-die-${rollKeepsIndex}-${value}`}
            value={value}
            onClick={() => removeRollKeep({ value, rollKeepsIndex })}
          />
        ))}
        <p>Roll Keeps Score: {turn.rollKeepsScore}</p>
      </div>
      <div>
        Round Keeps:
        {turn.roundKeeps.map((keepGroup) =>
          keepGroup.map((val, idx) => (
            <Die key={`keep-die-${idx}-${val}`} value={val} />
          ))
        )}
        <p>Round Keeps Score: {turn.roundKeepsScore}</p>
      </div>
      <p>Turn Keeps: {turn.turnKeeps}</p>
      <p>Turn Score: {turn.turnKeepsScore}</p>
      <p>Score: {turn.score}</p>
      {game?.currentTurn.status === "BUSTED" ? (
        <div>
          <h1>You Busted!</h1>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Button
            title="Roll"
            onClick={() => rollDice()}
            disabled={!turn.rollComplete}
          />
          {playerCanStay && <Button title="Stay" onClick={() => stay()} />}
        </div>
      )}
    </>
  );
}
