import Layout from "../../layouts/Layout";
import { useRouter } from "next/router";
import { GameProvider } from "../../context/GameContext";
import Game from "../../components/Game/Game";

export default function GamePage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout>
      <GameProvider id={id as string}>
        <Game />
      </GameProvider>
    </Layout>
  );
}
