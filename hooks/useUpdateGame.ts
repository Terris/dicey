import { useState } from "react";
import { ref, update, DatabaseReference } from "firebase/database";
import { db } from "../lib/firebase";
import { Player } from "../types/types";

interface UseUpdateGameProps {
  id?: string;
  onSuccess?: () => void;
}

export default function useUpdateGame({ id, onSuccess }: UseUpdateGameProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateGame({ players }: { players: Player[] }) {
    if (!id) return;
    setError(null);
    setLoading(true);

    try {
      await update(ref(db, `games/${id}`), {
        players,
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
