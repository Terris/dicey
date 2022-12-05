import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";

export interface GameProps {
  id: string;
}

interface UseCreateGameProps {
  onSuccess: (game: GameProps) => void;
}

export default function useCreateGame({ onSuccess }: UseCreateGameProps) {
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<GameProps | null>(null);

  async function createGame() {
    setError(null);
    setLoading(true);
    try {
      await signIn();
      if (!user) throw new Error("No user defined.");
      const gameDocRef = await addDoc(collection(db, "cities"), {
        owner: user?.uid,
      });
      setGame(gameDocRef);
      if (onSuccess) onSuccess(gameDocRef);
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
    game,
  };
}
