import { useState } from "react";
import { collection, addDoc, DocumentData } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { uniqueId } from "../utils";

interface UseCreateGameProps {
  onSuccess: (game: DocumentData) => void;
}

export default function useCreateGame({ onSuccess }: UseCreateGameProps) {
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<DocumentData | null>(null);

  async function createGame() {
    setError(null);
    setLoading(true);
    try {
      await signIn();
      if (!user) throw new Error("No user defined.");
      const gameDocRef = await addDoc(collection(db, "games"), {
        owner: user.uid,
        slug: uniqueId(6),
        players: [
          {
            uid: user.uid,
            name: "",
            score: 0,
          },
        ],
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
