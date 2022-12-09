import { scoreForKeeps } from "../utils";

type ACTION_TYPE =
  | {
      type: "ROLL_DICE";
      payload: { roll: number[]; status: "BUSTED" | "IN_PROGRESS" };
    }
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
  rollKeepsScore: number;
  roundCount: number;
  roundKeeps: number[][];
  roundKeepsScore: number;
  turnKeeps: number[][][];
  turnKeepsScore: number;
  status: "BUSTED" | "IN_PROGRESS";
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
  status: "IN_PROGRESS" as TurnStateProps["status"],
};

export default function reducer(state: TurnStateProps, action: ACTION_TYPE) {
  switch (action.type) {
    case "ROLL_DICE": {
      const newRoundKeeps = [...state.roundKeeps, state.rollKeeps].filter(
        (n) => n.length
      );
      const roundComplete = Boolean(
        state.rollCount > 0 && state.roll.length === 0
      );
      const newRoundScore = roundComplete
        ? 0
        : newRoundKeeps
            .map((keeps) => {
              return scoreForKeeps(keeps);
            })
            .reduce((partialSum, a) => partialSum + a, 0);
      const newTurnKeeps = roundComplete
        ? [...state.turnKeeps, newRoundKeeps]
        : state.turnKeeps;

      const newTurnKeepsScore = newTurnKeeps
        .map((round) =>
          round
            .map((keeps) => {
              return scoreForKeeps(keeps);
            })
            .reduce((partialSum, a) => partialSum + a, 0)
        )
        .reduce((partialSum, a) => partialSum + a, 0);

      return {
        ...state,
        rollCount: state.rollCount + 1,
        rollComplete: false,
        rollKeeps: [],
        rollKeepsScore: 0,
        roundCount: state.roundCount + 1,
        roundKeeps: roundComplete ? [] : newRoundKeeps,
        roundKeepsScore: newRoundScore,
        turnKeeps: newTurnKeeps,
        turnKeepsScore: newTurnKeepsScore,
        roll: action.payload.roll,
        status: action.payload.status,
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
      return {
        ...state,
        roll: newRoll,
        rollKeeps: newRollKeeps,
        rollKeepsScore: scoreForKeeps(newRollKeeps),
      };
    }
    case "REMOVE_ROLL_KEEP": {
      const newRollKeeps = state.rollKeeps.filter((value, index) => {
        if (index !== action.payload.rollKeepsIndex) {
          return value;
        }
      });
      return {
        ...state,
        rollKeeps: newRollKeeps,
        rollKeepsScore: scoreForKeeps(newRollKeeps),
        roll: [...state.roll, action.payload.value],
      };
    }
    default:
      throw new Error();
  }
}
