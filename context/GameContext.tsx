import {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { ref, onValue, DataSnapshot } from "firebase/database";
import { db } from "../lib/firebase";
import { Game } from "../types/types";
import { useAuth } from "./AuthContext";
import useUpdateGame from "../hooks/useUpdateGame";
import {
  getRandomDieValue,
  scoreForKeeps,
  scoreForTurn,
  rollHasPoints,
} from "../utils";

export interface GameContextProps {
  loading: boolean;
  error: string | null;
  game?: Game | null;
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
  stay: () => void;
}

const initialState = {
  loading: false,
  error: null,
  game: null,
  rollDice: () => null,
  addRollKeep: () => null,
  removeRollKeep: () => null,
  stay: () => null,
};

const GameContext = createContext<GameContextProps>(initialState);
export const useGame = () => useContext(GameContext);

// PROVIDER
// ==============================

interface GameProviderProps {
  children: ReactNode;
  id: string;
}

export const initialTurnState = {
  player: "",
  rollComplete: true,
  rollCount: 0,
  roll: [],
  rollKeeps: [],
  rollKeepsScore: 0,
  roundCount: 0,
  roundKeeps: [],
  roundKeepsScore: 0,
  turnKeeps: [],
  turnKeepsScore: 0,
  status: "IN_PROGRESS",
  score: 0,
};

export function GameProvider({ children, id }: GameProviderProps) {
  const { user } = useAuth();
  const { updateGame } = useUpdateGame({ id });

  // current user's turn state is managed in client
  // const [turn, dispatch] = useReducer(reducer, initialTurnState);

  // io game state is managed in firebase
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const currentTurn = game?.currentTurn || initialTurnState;

  // PRIVATE FUNCTIONS
  // ==============================

  const nextPlayer = useCallback(() => {
    if (!game || !user) return null;
    const currentPlayerIndex = game.players.findIndex(
      (player) => player.uid === user.uid
    );
    const nextPlayerIndex =
      currentPlayerIndex + 1 >= game.players.length
        ? 0
        : currentPlayerIndex + 1;
    const nextPlayer = game.players[nextPlayerIndex];
    return nextPlayer;
  }, [game, user]);

  // SIDE EFFECTS
  // ==============================

  // Subscribe to DB Game
  useEffect(() => {
    if (!id || !user) return;
    setLoading(true);
    const unsubscribe = onValue(
      ref(db, "games/" + id),
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        setGame({
          ...data,
          currentTurn: {
            ...initialTurnState,
            ...data.currentTurn,
          },
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [id, user]);

  useEffect(() => {
    if (!game) return;
    // TODO -if a player score is over limit, everyone gets one more chance
  }, [game]);

  // CONTEXT FUNCTIONS
  // ==============================
  async function rollDice() {
    if (!game) return;

    // Create new roll
    const newDiceCount =
      currentTurn.roll?.length > 0 ? currentTurn.roll?.length : 6;
    const newRoll = [];
    for (let i = 0; i < newDiceCount; i++) {
      newRoll.push(getRandomDieValue());
    }

    // Handle BUSTED
    if (!rollHasPoints(newRoll)) {
      updateGame({
        currentTurn: {
          ...currentTurn,
          status: "BUSTED",
        },
      });
      setTimeout(() => {
        updateGame({
          currentTurn: {
            ...initialTurnState,
            player: nextPlayer()?.uid || "",
          },
        });
      }, 5000);
      return;
    }

    const newRoundKeeps = [
      ...currentTurn.roundKeeps,
      currentTurn.rollKeeps,
    ].filter((n) => n.length);

    const roundComplete = Boolean(
      currentTurn.rollCount > 0 && currentTurn.roll.length === 0
    );

    const newRoundKeepsScore = roundComplete ? 0 : scoreForTurn(newRoundKeeps);

    const newTurnKeeps = [
      ...currentTurn?.turnKeeps,
      currentTurn?.rollKeeps,
    ].filter((n) => n.length);

    const newTurnKeepsScore = scoreForTurn(newTurnKeeps);

    await updateGame({
      currentTurn: {
        ...currentTurn,
        rollCount: currentTurn.rollCount + 1,
        rollComplete: false,
        rollKeeps: [],
        rollKeepsScore: 0,
        roundCount: currentTurn.roundCount + 1,
        roundKeeps: roundComplete ? [] : newRoundKeeps,
        roundKeepsScore: newRoundKeepsScore,
        turnKeeps: newTurnKeeps,
        turnKeepsScore: newTurnKeepsScore,
        roll: newRoll,
        score: newTurnKeepsScore,
      },
    });
  }

  async function addRollKeep({
    value,
    rollIndex,
  }: {
    value: number;
    rollIndex: number;
  }) {
    const newRoll = currentTurn.roll.filter((value, index) => {
      if (index !== rollIndex) {
        return value;
      }
    });
    const newRollKeeps = [...currentTurn.rollKeeps, value];
    const newScore = currentTurn.turnKeepsScore + scoreForKeeps(newRollKeeps);
    const rollComplete = newRollKeeps.length > 0;
    await updateGame({
      currentTurn: {
        ...currentTurn,
        roll: newRoll,
        rollKeeps: newRollKeeps,
        rollKeepsScore: scoreForKeeps(newRollKeeps),
        score: newScore,
        rollComplete,
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
    const newRollKeeps = currentTurn.rollKeeps.filter((val, index) => {
      if (index !== rollKeepsIndex) {
        return val;
      }
    });
    const newScore = currentTurn.turnKeepsScore + scoreForKeeps(newRollKeeps);
    const rollComplete = newRollKeeps.length > 0;
    updateGame({
      currentTurn: {
        ...currentTurn,
        rollKeeps: newRollKeeps,
        rollKeepsScore: scoreForKeeps(newRollKeeps),
        roll: [...currentTurn.roll, value],
        score: newScore,
        rollComplete,
      },
    });
  }

  async function stay() {
    if (!game || !user) return;
    const newPlayers = game?.players.map((player) => {
      if (player.uid === user?.uid) {
        return {
          ...player,
          score: player.score + currentTurn.score,
        };
      }
      return player;
    });
    await updateGame({
      players: newPlayers,
      currentTurn: {
        ...initialTurnState,
        player: nextPlayer()?.uid || "",
      },
    });
  }

  // RENDER
  // ==============================

  if (loading) return <p>Loading ...</p>;
  return (
    <GameContext.Provider
      value={{
        loading,
        error,
        game,
        rollDice,
        addRollKeep,
        removeRollKeep,
        stay,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
