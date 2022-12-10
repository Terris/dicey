import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { uniqueId } from "../utils";
import { initialTurnState } from "../context/GameContext";

interface UseCreateGameProps {
  onSuccess: (newGameId: string) => void;
}

export default function useCreateGame({ onSuccess }: UseCreateGameProps) {
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createGame() {
    setError(null);
    setLoading(true);
    try {
      await signIn();
      if (!user) throw new Error("No user defined.");
      const newGameRef = await push(ref(db, "games"));
      await set(newGameRef, {
        id: newGameRef.key,
        owner: user.uid,
        slug: uniqueId(6),
        status: "LOBBY",
        currentTurn: initialTurnState,
        onBoardThreshold: 1000,
        players: [
          {
            uid: user.uid,
            name: "",
            score: 0,
            ready: false,
            connected: true,
          },
        ],
      });
      if (onSuccess && newGameRef.key) onSuccess(newGameRef.key);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    error,
    loading,
    createGame,
  };
}
