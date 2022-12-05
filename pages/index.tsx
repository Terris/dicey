import { useRouter } from "next/router";
import useCreateGame from "../hooks/useCreateGame";
import Button from "../components/Button/Button";
import Layout from "../layouts/Layout";
import styles from "./Home.module.scss";

export default function Home() {
  const router = useRouter();
  const { loading, error, createGame, game } = useCreateGame({
    onSuccess: (game) => {
      router.push(`/game/${game.id}`);
    },
  });

  return (
    <Layout>
      <div className={styles.home}>
        {error && <p>{error}</p>}
        <Button
          title="Start New Game"
          onClick={() => createGame()}
          disabled={loading}
        />
      </div>
    </Layout>
  );
}
