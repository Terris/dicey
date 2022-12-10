import { scoreForKeeps, scoreForTurn, rollHasPoints } from "../utils";

type ACTION_TYPE =
  | {
      type: "ROLL_DICE";
      payload: number[];
    }
  | { type: "SET_ROLL_COMPLETE"; payload: boolean }
  | {
      type: "ADD_ROLL_KEEP";
      payload: { value: number; rollIndex: number };
    }
  | {
      type: "REMOVE_ROLL_KEEP";
      payload: { value: number; rollKeepsIndex: number };
    }
  | { type: "STAY" };

export interface TurnStateProps {
  rollComplete: boolean;
  rollCount: number;
  roll: number[];
  rollKeeps: number[];
  rollKeepsScore: number;
  roundCount: number;
  roundKeeps: number[][];
  roundKeepsScore: number;
  turnKeeps: number[][];
  turnKeepsScore: number;
  status: string;
  score: number;
}

export const initialState = {
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

export default function reducer(state: TurnStateProps, action: ACTION_TYPE) {
  switch (action.type) {
    case "ROLL_DICE": {
      const newStatus = rollHasPoints(action.payload)
        ? "IN_PROGRESS"
        : "BUSTED";

      if (newStatus === "BUSTED") {
        return {
          ...initialState,
          status: "BUSTED",
        };
      }

      const newRoundKeeps = [...state.roundKeeps, state.rollKeeps].filter(
        (n) => n.length
      );
      const roundComplete = Boolean(
        state.rollCount > 0 && state.roll.length === 0
      );
      const newRoundKeepsScore = roundComplete
        ? 0
        : scoreForTurn(newRoundKeeps);

      const newTurnKeeps = [...state.turnKeeps, state.rollKeeps].filter(
        (n) => n.length
      );

      const newTurnKeepsScore = scoreForTurn(newTurnKeeps);

      return {
        ...state,
        rollCount: state.rollCount + 1,
        rollComplete: false,
        rollKeeps: [],
        rollKeepsScore: 0,
        roundCount: state.roundCount + 1,
        roundKeeps: roundComplete ? [] : newRoundKeeps,
        roundKeepsScore: newRoundKeepsScore,
        turnKeeps: newTurnKeeps,
        turnKeepsScore: newTurnKeepsScore,
        roll: action.payload,
        status: newStatus,
        score: newTurnKeepsScore,
      };
    }
    case "SET_ROLL_COMPLETE": {
      return { ...state, rollComplete: action.payload };
    }

    case "ADD_ROLL_KEEP": {
      const newRoll = state.roll.filter((value, index) => {
        if (index !== action.payload.rollIndex) {
          return value;
        }
      });
      const newRollKeeps = [...state.rollKeeps, action.payload.value];
      const newScore = state.turnKeepsScore + scoreForKeeps(newRollKeeps);
      return {
        ...state,
        roll: newRoll,
        rollKeeps: newRollKeeps,
        rollKeepsScore: scoreForKeeps(newRollKeeps),
        score: newScore,
      };
    }
    case "REMOVE_ROLL_KEEP": {
      const newRollKeeps = state.rollKeeps.filter((value, index) => {
        if (index !== action.payload.rollKeepsIndex) {
          return value;
        }
      });
      const newScore = state.turnKeepsScore + scoreForKeeps(newRollKeeps);
      return {
        ...state,
        rollKeeps: newRollKeeps,
        rollKeepsScore: scoreForKeeps(newRollKeeps),
        roll: [...state.roll, action.payload.value],
        score: newScore,
      };
    }
    case "STAY": {
      return { ...initialState };
    }
    default:
      throw new Error();
  }
}
