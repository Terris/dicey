import { useEffect, useState } from "react";
import Die from "../../components/Die/Die";
import Button from "../../components/Button/Button";
import { getRandomDieValue } from "../../utils";

export default function Board() {
  const [turn, setTurn] = useState<number[][][]>([]);
  console.log("turn: ", turn);
  const [round, setRound] = useState<number>(0);
  const [roundKeeps, setRoundKeeps] = useState<number[][]>([]);
  console.log("round keeps: ", roundKeeps);

  const [rollComplete, setRollComplete] = useState<boolean>(true);
  const [rollCount, setRollCount] = useState<number>(0);
  const [roll, setRoll] = useState<number[]>([]);
  const [rollKeeps, setRollKeeps] = useState<number[]>([]);
  console.log("roll keeps: ", rollKeeps);

  useEffect(() => {
    if (rollCount === 0) return;
    setRollComplete(rollKeeps.length > 0);
  }, [rollCount, roll, rollKeeps]);

  function rollDice() {
    setRollCount((c) => c + 1);
    setRollComplete(false);

    // push rollKeeps to roundKeeps
    const newRoundKeeps = [...roundKeeps, rollKeeps];
    setRoundKeeps(newRoundKeeps);
    setRollKeeps([]);

    // push roundKeeps to turn
    if (rollCount > 0 && roll.length === 0) {
      setTurn((t) => [...t, newRoundKeeps]);
      setRoundKeeps([]);
      setRound((r) => r + 1);
    }

    const newDiceCount = roll.length > 0 ? roll.length : 6;
    const newRoll = [];
    for (let i = 0; i < newDiceCount; i++) {
      newRoll.push(getRandomDieValue());
    }
    setRoll(newRoll);
  }

  function handleAddKeep(value: number, currentRollIndex: number) {
    const newRoll = roll.filter((val, idx) => {
      if (idx !== currentRollIndex) {
        return val;
      }
    });
    setRoll(newRoll);
    setRollKeeps((keeps) => [...keeps, value]);
  }

  function handleRemoveKeep(value: number, rollIndex: number) {
    const newKeeps = rollKeeps.filter((val, idx) => {
      if (idx !== rollIndex) {
        return val;
      }
    });
    setRollKeeps(newKeeps);
    setRoll((roll) => [...roll, value]);
  }

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
        {roll.map((val, idx) => (
          <Die
            key={`roll-die-${idx}-${val}`}
            value={val}
            onClick={() => handleAddKeep(val, idx)}
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
        {rollKeeps.map((val, idx) => (
          <Die
            key={`keep-die-${idx}-${val}`}
            value={val}
            onClick={() => handleRemoveKeep(val, idx)}
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
        {roundKeeps.map((keepGroup) =>
          keepGroup.map((val, idx) => (
            <Die key={`keep-die-${idx}-${val}`} value={val} />
          ))
        )}
      </div>
      <p>{turn}</p>
      <div style={{ textAlign: "center" }}>
        <Button
          title="Roll"
          onClick={() => rollDice()}
          disabled={!rollComplete}
        />
      </div>
    </>
  );
}
