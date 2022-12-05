import { useRouter } from "next/router";
import Layout from "../../layouts/Layout";
import useGame from "../../hooks/useGame";
import styles from "./Game.module.scss";

import Board from "../../components/Board/Board";

export default function Game() {
  const router = useRouter();
  const { id } = router.query;
  const { error, game } = useGame({ id: id as string });

  return (
    <Layout>
      {error && <p>{error}</p>}
      {game ? (
        <div className={styles.game}>
          <div className={styles["sidebar-left"]}>
            <p>Player Scores</p>
          </div>
          <div className={styles.board}>
            <p style={{ textAlign: "center" }}>Game #{game.slug}</p>
            <Board />
          </div>
          <div className={styles["sidebar-right"]}>
            <p>Chat</p>
          </div>
        </div>
      ) : null}
    </Layout>
  );
}
