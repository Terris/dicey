import { useRouter } from "next/router";
import Layout from "../../layouts/Layout";
import styles from "./Game.module.scss";

export default function Game() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <div className={styles.game}>
        <div className={styles["sidebar-left"]}>
          <h3>Sidebar Left</h3>
        </div>
        <div className={styles.board}>
          <h2>Game ID: {id}</h2>
        </div>
        <div className={styles["sidebar-right"]}>
          <h3>Sidebar Right</h3>
        </div>
      </div>
    </Layout>
  );
}
