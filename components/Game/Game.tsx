import { useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import NewPlayerScreen from "../../components/NewPlayerScreen/NewPlayerScreen";
import PlayerScores from "../../components/PlayerScores/PlayerScores";
import Lobby from "../../components/Lobby/Lobby";
import { Player } from "../../types/types";
import styles from "./Game.module.scss";
import Board from "../Board/Board";
import WatchBoard from "../Board/WatchBoard";

export default function Game() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const { error, game } = useGame();

  const userPlayer = useMemo(() => {
    return game?.players.find((player: Player) => player.uid === user?.uid);
  }, [game, user?.uid]);

  const showNewPlayerScreen = useMemo(() => {
    return game && user && (!userPlayer || !userPlayer.name);
  }, [game, user, userPlayer]);

  if (!game || !user) return null;

  return (
    <>
      {error && <p>{error}</p>}
      {game ? (
        <div className={styles.game}>
          <div className={styles["sidebar-left"]}>
            <PlayerScores />
          </div>
          <div className={styles.board}>
            <p style={{ textAlign: "center" }}>Game #{id}</p>
            {game.status === "LOBBY" ? (
              <Lobby />
            ) : game.currentTurn.player === user.uid ? (
              <Board />
            ) : (
              <WatchBoard />
            )}
          </div>
          <div className={styles["sidebar-right"]}>
            <p>Chat</p>
          </div>
        </div>
      ) : null}
      {showNewPlayerScreen && <NewPlayerScreen game={game} />}
    </>
  );
}
