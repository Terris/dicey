import { useState } from "react";
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
