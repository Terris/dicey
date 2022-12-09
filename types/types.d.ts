export type Player = {
  uid: string;
  name: string;
  score: string;
  ready: boolean;
  connected: boolean;
};

export enum GameStatus {
  LOBBY = "LOBBY",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE",
}
export type Game = {
  id: string;
  owner: string;
  status: GameStatus;
  slug: string;
  players: Player[];
  currentTurn: CurrentTurn;
};

export enum TurnStatus {
  BUSTED = "BUSTED",
  IN_PROGRESS = "IN_PROGRESS",
}

export type CurrentTurn = {
  player: string;
  roll: number[];
  keeps: number[][];
  score: number;
  status: TurnStatus;
};
