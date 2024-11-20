import { Selector } from '@ngxs/store';
import { PlayerState } from '../states/player.state';
import { PlayerModel, PlayerStateModel } from '../models/player.model';

export class PlayerSelectors {
  private static readonly WON_FACTOR = 3;
  private static readonly TIE_FACTOR = 1;

  @Selector([PlayerState])
  static players(state: PlayerStateModel): Array<PlayerModel> {
    return state.players;
  }

  @Selector([PlayerState])
  static winningPlayerId(state: PlayerStateModel): string | null {
    const {
      roundWons: firstWons,
      roundTied: firstTies,
      id: firstPlayerId,
    } = state.players[0];
    const {
      roundWons: secondWons,
      roundTied: secondTies,
      id: secondPlayerId,
    } = state.players[1];
    const firstPlayerScore =
      firstWons * PlayerSelectors.WON_FACTOR +
      firstTies * PlayerSelectors.TIE_FACTOR;
    const secondPlayerScore =
      secondWons * PlayerSelectors.WON_FACTOR +
      secondTies * PlayerSelectors.TIE_FACTOR;

    if (firstPlayerScore > secondPlayerScore) {
      return firstPlayerId;
    }

    if (firstPlayerScore === secondPlayerScore) {
      return null;
    }

    return secondPlayerId;
  }
}
