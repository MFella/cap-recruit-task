export interface PlayerModel {
  id: string;
  roundWons: number;
  roundLost: number;
  roundTied: number;
}

export interface PlayerStateModel {
  players: Array<PlayerModel>;
}
