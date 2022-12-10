import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { DocumentData } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import useUpdateGame from "../../hooks/useUpdateGame";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";
import type { Player } from "../../types/types";
import styles from "./NewPlayerScreen.module.scss";

interface NewPlayerScreenProps {
  game?: DocumentData | null;
}

export default function NewPlayerScreen({ game }: NewPlayerScreenProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [nickname, setNickname] = useState<string>("");
  const { loading, error, updateGame } = useUpdateGame({ id: id as string });
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleAddNickname(e: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setValidationError(null);
    if (nickname === "") {
      setValidationError("Nickname is required.");
      return;
    }

    // update the existing player or add a new one
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
      : [
          ...game?.players,
          {
            uid: user?.uid,
            name: nickname,
            score: 0,
            ready: false,
            connected: true,
          },
        ];

    await updateGame({ players: newPlayers });
  }

  return (
    <div className={styles["new-player-screen-wrapper"]}>
      <div className={styles["new-player-screen"]}>
        <h2 className={styles.title}>Welcome, new player!</h2>
        {error && <p style={{ color: "red", paddingTop: "1rem" }}>{error}</p>}
        <p>What shall we call you?</p>
        <form onSubmit={(e) => handleAddNickname(e)}>
          {validationError && (
            <p style={{ color: "red", paddingTop: "1rem" }}>
              {validationError}
            </p>
          )}
          <TextInput
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={loading}
          />

          <Button title="Let's Roll!" disabled={loading} />
        </form>
      </div>
    </div>
  );
}
