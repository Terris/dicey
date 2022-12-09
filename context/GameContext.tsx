import {
  useEffect,
  useState,
  useCallback,
  useReducer,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../lib/firebase";
import { Game } from "../types/types";
import { useAuth } from "./AuthContext";
import useUpdateGame from "../hooks/useUpdateGame";
import reducer, {
  initialState as initialTurnState,
  TurnStateProps,
} from "./GameReducer";
import { getRandomDieValue, rollHasPoints } from "../utils";

export interface GameContextProps {
  loading: boolean;
  error: string | null;
  game?: Game | null;
  turn: TurnStateProps;
  rollDice: () => void;
  addRollKeep: ({
    value,
    rollIndex,
  }: {
    value: number;
    rollIndex: number;
  }) => void;
  removeRollKeep: ({
    value,
    rollKeepsIndex,
  }: {
    value: number;
    rollKeepsIndex: number;
  }) => void;
}

const initialState = {
  loading: false,
  error: null,
  game: null,
  turn: initialTurnState,
  rollDice: () => null,
  addRollKeep: () => null,
  removeRollKeep: () => null,
};

const GameContext = createContext<GameContextProps>(initialState);
export const useGame = () => useContext(GameContext);

// PROVIDER
// ==============================

interface GameProviderProps {
  children: ReactNode;
  id: string;
}

export function GameProvider({ children, id }: GameProviderProps) {
  const { user } = useAuth();
  const { updateGame } = useUpdateGame({ id });

  // current user's turn state is managed in client
  const [turn, dispatch] = useReducer(reducer, initialTurnState);

  // io game state is managed in firebase
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);

  // SUBSCRIBE TO DB GAME
  useEffect(() => {
    if (!id || !user) return;
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
  }, [id, user]);

  // User can roll if user has rollKeeps
  useEffect(() => {
    if (turn.rollCount === 0) return;
    dispatch({ type: "SET_ROLL_COMPLETE", payload: turn.rollKeeps.length > 0 });
  }, [turn.rollCount, turn.roll, turn.rollKeeps]);

  const updateDbTurn = useCallback(async () => {
    await updateGame({
      currentTurn: {
        player: game?.currentTurn.player || "",
        roll: turn.roll,
        keeps: turn.roundKeeps,
        score: turn.score,
        status: turn.status,
      },
    });
  }, [turn, game, updateGame]);

  //sync current turn with db
  useEffect(() => {
    if (!game) return;
    updateDbTurn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn]);

  async function rollDice() {
    if (!game) return;
    const newDiceCount = turn.roll.length > 0 ? turn.roll.length : 6;
    const newRoll = [];
    for (let i = 0; i < newDiceCount; i++) {
      newRoll.push(getRandomDieValue());
    }
    dispatch({
      type: "ROLL_DICE",
      payload: newRoll,
    });
  }

  function addRollKeep({
    value,
    rollIndex,
  }: {
    value: number;
    rollIndex: number;
  }) {
    dispatch({
      type: "ADD_ROLL_KEEP",
      payload: {
        value,
        rollIndex,
      },
    });
  }

  function removeRollKeep({
    value,
    rollKeepsIndex,
  }: {
    value: number;
    rollKeepsIndex: number;
  }) {
    dispatch({ type: "REMOVE_ROLL_KEEP", payload: { value, rollKeepsIndex } });
  }

  if (loading) return <p>Loading ...</p>;
  return (
    <GameContext.Provider
      value={{
        loading,
        error,
        game,
        turn,
        rollDice,
        addRollKeep,
        removeRollKeep,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
