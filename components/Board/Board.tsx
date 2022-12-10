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
  const { game, rollDice, addRollKeep, removeRollKeep, stay } = useGame();

  // Show toast on current users turn
  useEffect(() => {
    if (!game) return;
    if (
      game.currentTurn.player === user?.uid &&
      !game.currentTurn.roll?.length
    ) {
      toast.success("Your turn!", { duration: 4000 });
    }
  }, [game, user?.uid, game?.currentTurn?.roll?.length]);

  const playerCanStay =
    game?.currentTurn.rollKeeps && game?.currentTurn?.rollKeeps?.length > 0;

  if (!game || !user) return null;
  return (
    <>
      <div className={styles.board}>
        {game.currentTurn.roll?.map((value, rollIndex) => (
          <Die
            key={`roll-die-${rollIndex}-${value}`}
            value={value}
            onClick={() => addRollKeep({ value, rollIndex })}
            disabled={
              !canKeepDie({
                roll: mergeRollAndKeeps(
                  game.currentTurn.roll,
                  game.currentTurn.rollKeeps
                ),
                die: value,
              })
            }
          />
        ))}
      </div>
      <div>
        Roll keeps:
        {game.currentTurn.rollKeeps.map((value, rollKeepsIndex) => (
          <Die
            key={`keep-die-${rollKeepsIndex}-${value}`}
            value={value}
            onClick={() => removeRollKeep({ value, rollKeepsIndex })}
          />
        ))}
      </div>
      <div>
        Round Keeps:
        {game.currentTurn.roundKeeps?.map((keepGroup) =>
          keepGroup.map((val, idx) => (
            <Die key={`keep-die-${idx}-${val}`} value={val} />
          ))
        )}
      </div>
      <p>Score: {game.currentTurn.score}</p>
      {game.currentTurn.status === "BUSTED" ? (
        <div>
          <h1>You Busted!</h1>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Button
            title="Roll"
            onClick={() => rollDice()}
            disabled={!game.currentTurn.rollComplete}
          />
          {playerCanStay && <Button title="Stay" onClick={() => stay()} />}
        </div>
      )}
    </>
  );
}
