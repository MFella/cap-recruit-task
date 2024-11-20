import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { PlayerStateModel } from '../models/player.model';
import { PlayerModel } from '../models/player.model';
import { UpdatePlayerScore } from '../actions/player.actions';
import { patch, updateItem } from '@ngxs/store/operators';

const defaultPlayerModel: Array<PlayerModel> = Array(2)
  .fill(0)
  .map(() => ({
    id: Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(2, 10),
    roundLost: 0,
    roundTied: 0,
    roundWons: 0,
  }));

@State<PlayerStateModel>({
  name: 'player',
  defaults: {
    players: defaultPlayerModel,
  },
})
@Injectable()
export class PlayerState {
  @Action(UpdatePlayerScore)
  updatePlayerScore(
    context: StateContext<PlayerStateModel>,
    action: UpdatePlayerScore
  ): void {
    const state = context.getState();
    const playerToUpdate = state.players.find(
      model => model.id === action.playerId
    );
    if (!playerToUpdate) {
      return;
    }

    context.setState(
      patch({
        players: updateItem(
          item => item.id === action.playerId,
          patch({
            roundLost: action.roundLost,
            roundTied: action.roundTied,
            roundWons: action.roundWons,
          })
        ),
      })
    );
  }
}
