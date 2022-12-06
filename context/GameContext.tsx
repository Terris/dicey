import { createContext, useContext, useReducer, ReactNode } from "react";

interface GameContextProps {
  id?: string | null;
  roll: () => void;
}

const initialState = {
  id: null,
  roll: () => null,
};

const GameContext = createContext<GameContextProps>(initialState);

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

export default function GameProvider({ children, id }: GameProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    return { ...initialState, id };
  });

  return <GameContext.Provider value={state}>{children}</GameContext.Provider>;
}

export const useGameContext = () => useContext(GameContext);
