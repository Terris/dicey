import Game from "../components/Game/Game";

export type Player = {
  uid: string;
  name: string;
  score: string;
  ready: boolean;
  connected: boolean;
};

export type Game = {
  id: string;
  owner: string;
  status: string; // "LOBBY" | "IN_PROGRESS" | "COMPLETE"
  slug: string;
  players: Player[];
  currentTurn: CurrentTurn;
  onBoardThreshold: number;
};

export type CurrentTurn = {
  player: string;
  score: number;
  status: string; // "IN_PROGRESS" | "BUSTED"
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
};
