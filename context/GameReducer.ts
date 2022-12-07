import { GameContextProps } from "./GameContext";

type ACTION_TYPE =
  | { type: "ROLL_DICE"; payload: number[] }
  | { type: "SET_ROLL_COMPLETE"; payload: boolean }
  | {
      type: "ADD_ROLL_KEEP";
      payload: { value: number; rollIndex: number };
    }
  | {
      type: "REMOVE_ROLL_KEEP";
      payload: { value: number; rollKeepsIndex: number };
    };

export interface TurnStateProps {
  rollComplete: boolean;
  rollCount: number;
  roll: number[];
  rollKeeps: number[];
  roundCount: number;
  roundKeeps: number[][];
  turnKeeps: number[][][];
}

export const initialState = {
  rollComplete: true,
  rollCount: 0,
  roll: [],
  roundCount: 0,
  roundKeeps: [],
  rollKeeps: [],
  turnKeeps: [],
};

export default function reducer(state: TurnStateProps, action: ACTION_TYPE) {
  switch (action.type) {
    case "ROLL_DICE":
      const newRoundKeeps = [...state.roundKeeps, state.rollKeeps];
      const roundComplete = Boolean(
        state.rollCount > 0 && state.roll.length === 0
      );
      const newState = {
        rollCount: state.rollCount + 1,
        rollComplete: false,
        rollKeeps: [],
        turnKeeps: roundComplete
          ? [...state.turnKeeps, newRoundKeeps]
          : state.turnKeeps,
        roundKeeps: roundComplete ? [] : newRoundKeeps,
        roundCount: state.roundCount + 1,
        roll: action.payload,
      };
      return { ...state, ...newState };
    case "SET_ROLL_COMPLETE":
      return { ...state, rollComplete: action.payload };
    case "ADD_ROLL_KEEP":
      const newRoll = state.roll.filter((value, index) => {
        if (index !== action.payload.rollIndex) {
          return value;
        }
      });
      return {
        ...state,
        roll: newRoll,
        rollKeeps: [...state.rollKeeps, action.payload.value],
      };
    case "REMOVE_ROLL_KEEP":
      const newKeeps = state.rollKeeps.filter((value, index) => {
        if (index !== action.payload.rollKeepsIndex) {
          return value;
        }
      });
      return {
        ...state,
        rollKeeps: newKeeps,
        roll: [...state.roll, action.payload.value],
      };

    default:
      throw new Error();
  }
}
