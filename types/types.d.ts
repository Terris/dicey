export type Player = {
  uid: string;
  name: string;
  score: string;
};

export type Game = {
  id: string;
  owner: string;
  slug: string;
  players: Player[];
};
