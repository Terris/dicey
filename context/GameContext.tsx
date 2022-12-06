import {
  useEffect,
  useState,
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";
import { ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../lib/firebase";

interface GameContextProps {
  game?: DataSnapshot | null;
  loading: boolean;
  error: string | null;
  roll: () => void;
}

const initialState = {
  game: null,
  loading: false,
  error: null,
  id: null,
  roll: () => null,
};

const GameContext = createContext<GameContextProps>(initialState);
export const useGame = () => useContext(GameContext);

type ACTIONTYPE = { type: "roll" } | { type: "decrement"; payload: number };

function reducer(state: GameContextProps, action: ACTIONTYPE) {
  switch (action.type) {
    case "roll":
      return { ...state };
    default:
      throw new Error();
  }
}

interface GameProviderProps {
  children: ReactNode;
  id: string;
}

export function GameProvider({ children, id }: GameProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<DataSnapshot | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const unsubscribe = onValue(
      ref(db, "games/" + id),
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        setGame(data);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [id]);

  return (
    <GameContext.Provider value={{ ...state, game, loading, error }}>
      {children}
    </GameContext.Provider>
  );
}
