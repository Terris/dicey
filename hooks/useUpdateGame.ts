import { useState } from "react";
import { ref, update, DatabaseReference } from "firebase/database";
import { db } from "../lib/firebase";
import { CurrentTurn, Game } from "../types/types";

interface UseUpdateGameProps {
  id?: string;
  onSuccess?: () => void;
}

interface UpdatableGame extends Partial<Omit<Game, "currentTurn">> {
  currentTurn?: Partial<CurrentTurn>;
}

export default function useUpdateGame({ id, onSuccess }: UseUpdateGameProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateGame(options: UpdatableGame) {
    if (!id) return;
    setError(null);
    setLoading(true);

    try {
      await update(ref(db, `games/${id}`), {
        ...options,
      });
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    error,
    loading,
    updateGame,
  };
}
