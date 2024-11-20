import { PlayerModel } from '../models/player.model';

export class UpdatePlayerScore {
  static readonly type = '[Player] Update score';
  constructor(
    public readonly playerId: string,
    public readonly roundWons: number,
    public readonly roundLost: number,
    public readonly roundTied: number
  ) {}
}

export class ChangeStatus {
  static readonly type = '[Player] Change status';
  constructor(public readonly playerModel: PlayerModel) {}
}
