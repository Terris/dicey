import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useGame } from "../../context/GameContext";
import { useAuth } from "../../context/AuthContext";
import Die from "../../components/Die/Die";
import Button from "../../components/Button/Button";

export default function Board() {
  const { user } = useAuth();
  const { game, turn, rollDice, addRollKeep, removeRollKeep } = useGame();

  // Show toast on current users turn
  useEffect(() => {
    if (!game) return;
    if (game.currentTurn.player === user?.uid && !turn.roll.length) {
      toast.success("Your turn!", { duration: 4000 });
    }
  }, [game, user?.uid, turn.roll.length]);

  return (
    <>
      <div
        style={{
          padding: "2rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        Roll:
        {turn.roll.map((value, rollIndex) => (
          <Die
            key={`roll-die-${rollIndex}-${value}`}
            value={value}
            onClick={() => addRollKeep({ value, rollIndex })}
          />
        ))}
      </div>
      <div
        style={{
          padding: "2rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        Roll keeps:
        {turn.rollKeeps.map((value, rollKeepsIndex) => (
          <Die
            key={`keep-die-${rollKeepsIndex}-${value}`}
            value={value}
            onClick={() => removeRollKeep({ value, rollKeepsIndex })}
          />
        ))}
      </div>
      <div
        style={{
          padding: "2rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        Round Keeps:
        {turn.roundKeeps.map((keepGroup) =>
          keepGroup.map((val, idx) => (
            <Die key={`keep-die-${idx}-${val}`} value={val} />
          ))
        )}
      </div>
      <p>{turn.turnKeeps}</p>
      <div style={{ textAlign: "center" }}>
        <Button
          title="Roll"
          onClick={() => rollDice()}
          disabled={!turn.rollComplete}
        />
      </div>
    </>
  );
}
