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
  status: "LOBBY" | "IN_PROGRESS" | "COMPLETE";
  slug: string;
  players: Player[];
};
