import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { DocumentData } from "firebase/firestore";
import Layout from "../../layouts/Layout";
import { useAuth } from "../../context/AuthContext";
import useGame from "../../hooks/useGame";
import useUpdateGame from "../../hooks/useUpdateGame";
import TextInput from "../../components/TextInput/TextInput";
import Board from "../../components/Board/Board";
import Button from "../../components/Button/Button";
import type { Player } from "../../types/types";
import styles from "./Game.module.scss";

export default function Game() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const { error, game } = useGame({ id: id as string, pause: !user });

  const userPlayer = useMemo(() => {
    return game?.players.find((player: Player) => player.uid === user?.uid);
  }, [game, user?.uid]);

  const showNewPlayerScreen = useMemo(() => {
    return game && user && (!userPlayer || !userPlayer.name);
  }, [game, user, userPlayer]);

  return (
    <Layout>
      {error && <p>{error}</p>}
      {game ? (
        <div className={styles.game}>
          <div className={styles["sidebar-left"]}>
            <p style={{ fontWeight: 700 }}>Player Scores</p>
            {game?.players.map((player: Player) => (
              <div key={player.uid}>
                <p>
                  {player.name} {game?.owner === player?.uid && "*"}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.board}>
            <p style={{ textAlign: "center" }}>Game #{id}</p>
            <Board />
          </div>
          <div className={styles["sidebar-right"]}>
            <p>Chat</p>
          </div>
        </div>
      ) : null}
      {showNewPlayerScreen && <NewPlayerScreen game={game} />}
    </Layout>
  );
}

interface NewPlayerScreenProps {
  game?: DocumentData;
}

function NewPlayerScreen({ game }: NewPlayerScreenProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [nickname, setNickname] = useState<string>("");
  const { loading, error, updateGame } = useUpdateGame({ id: id as string });
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleAddNickname() {
    setValidationError(null);
    if (nickname === "") {
      setValidationError("Nickname is required.");
      return;
    }

    // update a current player or add a new one
    const isCurrentPlayer = game?.players.find(
      (player: Player) => player.uid === user?.uid
    );
    const newPlayers = isCurrentPlayer
      ? game?.players.map((player: Player) => {
          if (player.uid === user?.uid) {
            return {
              ...player,
              name: nickname,
            };
          }
          return player;
        })
      : [...game?.players, { uid: user?.uid, name: nickname, score: 0 }];

    await updateGame({ players: newPlayers });
  }

  const mergedErrors = [error, validationError].join(" ");

  return (
    <div className={styles["new-player-screen-wrapper"]}>
      <div className={styles["new-player-screen"]}>
        <h2>Welcome, new player!</h2>
        <p>What shall we call you?</p>
        {mergedErrors && (
          <p style={{ color: "red", paddingTop: "1rem" }}>{mergedErrors}</p>
        )}
        <TextInput
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          disabled={loading}
        />
        <Button
          title="Let's Roll!"
          onClick={() => handleAddNickname()}
          disabled={loading}
        />
      </div>
    </div>
  );
}
