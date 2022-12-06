import { useState } from "react";
import { doc, updateDoc, DocumentData } from "firebase/firestore";
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
      await updateDoc(doc(db, "games", id), {
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
