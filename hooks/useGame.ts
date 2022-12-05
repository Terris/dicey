import { useEffect, useState } from "react";
import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../lib/firebase";

interface UseGameProps {
  id?: string;
}

export default function useGame({ id }: UseGameProps) {
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<DocumentData>();

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(
      doc(db, "games", id),
      (doc) => {
        setGame(doc.data());
      },
      (error) => {
        setError(error.message);
      }
    );
    return () => unsubscribe();
  }, [id]);

  return { error, game };
}
