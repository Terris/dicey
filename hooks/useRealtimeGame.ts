import { useEffect, useState } from "react";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../lib/firebase";

interface UseGameProps {
  id?: string;
  pause?: boolean;
}

export default function useRealtimeGame({ id, pause }: UseGameProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<DocumentData>();

  useEffect(() => {
    if (!id || pause) return;
    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, "games", id),
      (doc) => {
        setGame(doc.data());
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [id, pause]);

  return { loading, error, game };
}
