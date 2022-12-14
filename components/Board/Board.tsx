import { useEffect, useMemo } from "react";
import Head from "next/head";
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

  const isThisPlayersTurn = game?.currentTurn.player === user?.uid;

  // Show toast on current users turn
  useEffect(() => {
    if (
      !game ||
      !game.currentTurn.roll?.length ||
      game.currentTurn?.score >= 0 ||
      !isThisPlayersTurn
    ) {
      return;
    }
    toast.success("Your turn!", { duration: 4000 });
  }, [game, user?.uid, game?.currentTurn?.roll?.length, isThisPlayersTurn]);

  const currentPlayer = game?.players.find(
    (player) => player.uid === user?.uid
  );
  const playerCanStay =
    (game?.currentTurn?.score && game?.currentTurn?.score >= 1000) ||
    (currentPlayer?.score &&
      currentPlayer?.score >= 1000 &&
      game?.currentTurn.rollKeeps &&
      game?.currentTurn?.rollKeeps?.length > 0);

  if (!game || !user) return null;
  return (
    <>
      <Head>
        <title>{`${isThisPlayersTurn && "Your Turn! | "} D I C E Y`}</title>
      </Head>

      <div className={styles.board}>
        <p style={{ textAlign: "center" }}>Score: {game.currentTurn.score}</p>
        <div className={styles["roll-area"]}>
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
        <div className={styles["keep-area"]}>
          <div className={styles["keep-area-rollkeeps"]}>
            {game.currentTurn.rollKeeps.map((value, rollKeepsIndex) => (
              <Die
                key={`keep-die-${rollKeepsIndex}-${value}`}
                value={value}
                onClick={() => removeRollKeep({ value, rollKeepsIndex })}
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

        <div style={{ textAlign: "center" }}>
          <Button
            title="Roll"
            onClick={() => rollDice()}
            disabled={
              !game.currentTurn.rollComplete ||
              game.currentTurn.status === "BUSTED"
            }
            style={{ marginRight: "2rem" }}
          />

          <Button
            title="Stay"
            onClick={() => stay()}
            style={{ marginLeft: "2rem" }}
            disabled={!playerCanStay || game.currentTurn.status === "BUSTED"}
          />
        </div>
        {game.currentTurn.status === "BUSTED" && (
          <div className={styles.busted}>
            <h1>You Busted!</h1>
          </div>
        )}
        {game.currentTurn.status === "STAYED" && (
          <div className={styles.stayed}>
            <h1>
              You Stayed <br />
              with {game.currentTurn.score}!
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
