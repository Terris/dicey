import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import useUpdateGame from "../../hooks/useUpdateGame";
import Button from "../Button/Button";
import TextButton from "../TextButton/TextButton";
import styles from "./Lobby.module.scss";
import { Player } from "../../types/types";

export default function Lobby() {
  const { user } = useAuth();
  const { game } = useGame();
  const { updateGame } = useUpdateGame({ id: game?.id });

  const userIsOwner = game?.owner === user?.uid;
  const allPlayersReady = game?.players.every((player) => player.ready);

  return (
    <div className={styles.lobby}>
      <h2 style={{ marginBottom: "2rem" }}>Lobby</h2>
      <div className={styles.players}>
        {game?.players.map((player) => (
          <PlayerCard key={player.uid} player={player} />
        ))}
      </div>

      {userIsOwner && (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          <Button
            title="Start the Game!"
            disabled={!allPlayersReady}
            onClick={() => updateGame({ status: "IN_PROGRESS" })}
          />
        </div>
      )}
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
}

function PlayerCard({ player }: PlayerCardProps) {
  const { user } = useAuth();
  const { game } = useGame();
  const { updateGame } = useUpdateGame({ id: game?.id });

  function toggleReady() {
    if (!game) return;
    const newPlayers = game?.players.map((p) => {
      if (p.uid === player.uid) {
        return {
          ...p,
          ready: !p.ready,
        };
      }
      return p;
    });
    updateGame({ players: newPlayers });
  }

  return (
    <div className={styles["player"]}>
      <p>{player.name}</p>
      <TextButton
        onClick={() => toggleReady()}
        disabled={player.uid !== user?.uid}
      >
        <span
          style={{
            color: player.ready ? "green" : "red",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ paddingRight: "0.5rem" }}>
            {player.ready ? "Ready" : "Not ready"}{" "}
          </span>

          {player.ready ? (
            <RiCheckboxCircleFill size={28} />
          ) : (
            <RiCheckboxBlankCircleLine size={28} />
          )}
        </span>
      </TextButton>
    </div>
  );
}
