import { useRouter } from "next/router";
import useCreateGame from "../hooks/useCreateGame";
import Button from "../components/Button/Button";
import Layout from "../layouts/Layout";
import styles from "./Home.module.scss";

export default function Home() {
  const router = useRouter();
  const { loading, error, createGame, game } = useCreateGame({
    onSuccess: (game) => {
      router.push(`/games/${game.id}`);
    },
  });

  return (
    <Layout>
      <div className={styles.home}>
        {error && <p>{error}</p>}
        <h2 style={{ paddingBottom: "2rem" }}>Play Dice 10K with friends.</h2>
        <Button
          title="Start New Game"
          onClick={() => createGame()}
          disabled={loading}
        />
      </div>
    </Layout>
  );
}
