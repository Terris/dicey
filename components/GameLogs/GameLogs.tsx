import { useMemo } from "react";
import { useGame } from "../../context/GameContext";
import styles from "./GameLogs.module.scss";

export default function Logs() {
  const { game } = useGame();

  const logs = useMemo(() => {
    return [...(game?.logs || [])].reverse();
  }, [game?.logs]);

  return (
    <div className={styles["game-logs"]}>
      <p style={{ fontWeight: 700, paddingBottom: "6px" }}>Game Logs</p>
      {logs.map((log, index) => (
        <p
          key={`log-${index}-${log.message}`}
          className={styles["game-log-message"]}
        >
          {log.message}
        </p>
      ))}
    </div>
  );
}
