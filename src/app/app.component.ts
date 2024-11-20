import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameCardComponent } from './game-card/game-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RestService } from './_services/rest.service';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import {
  CompoundEntityDTO,
  EntityBattleResult,
  EntityType,
} from './types/entity.types';
import { EntityComparator } from './_helpers/entity-comparator';
import { NgClass } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PlayerModel } from './infrastructure/models/player.model';
import { Store } from '@ngxs/store';
import { PlayerSelectors } from './infrastructure/selectors/player.selectors';
import { UpdatePlayerScore } from './infrastructure/actions/player.actions';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RuleDialogComponent } from './rule-dialog/rule-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

type ResourceKind<T extends EntityType | 'anything' = EntityType | 'anything'> =
  {
    value: T;
    label: Capitalize<T>;
  };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GameCardComponent,
    MatButtonModule,
    MatIconModule,
    NgClass,
    MatSnackBarModule,
    MatSlideToggleModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  store = inject(Store);

  players$: Observable<Array<PlayerModel>> = inject(Store).select(
    PlayerSelectors.players
  );
  winningPlayerId$: Observable<string | null> = inject(Store).select(
    PlayerSelectors.winningPlayerId
  );
  restService = inject(RestService);

  resourceKindControl: FormControl = new FormControl('anything');
  resourceKinds: Array<ResourceKind> = [
    { value: 'starships', label: 'Starships' },
    { value: 'people', label: 'People' },
    { value: 'anything', label: 'Anything' },
  ];

  entityList?: [
    CompoundEntityDTO<EntityType>?,
    CompoundEntityDTO<EntityType>?
  ] = [undefined, undefined];
  isFirstGame = true;
  isLoading = false;
  rollUntilSuccess = false;

  gamePlayers: Array<PlayerModel> = [];
  winningPlayerId: string | null = null;

  private readonly matDialog = inject(MatDialog);
  private readonly matSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.observePlayers();
    this.observeWinningPlayerId();
  }

  async playGame(): Promise<void> {
    this.isLoading = true;

    if (this.rollUntilSuccess) {
      let isFetchSuccessful = false;

      while (!isFetchSuccessful) {
        try {
          const getRandomEntitiesResult = await firstValueFrom(
            this.selectRandomEntities()
          );
          this.processRandomEntities(getRandomEntitiesResult);
        } catch (_error: unknown) {
          continue;
        }

        isFetchSuccessful = true;
      }
      return;
    }

    this.selectRandomEntities().subscribe({
      next: this.processRandomEntities.bind(this),
      error: (error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.NotFound) {
          const errorMessage = `Random entity cannot be found. Origin error message: ${error.message}`;
          console.error('Random entity cannot be found');
          this.displayErrorMessage(errorMessage);
        } else {
          this.displayErrorMessage(error.message);
        }

        this.isLoading = false;
      },
      complete: () => {
        this.isFirstGame = false;
      },
    });
  }

  getBattleResultClass(
    entityBattleResult: EntityBattleResult | undefined,
    gamePlayer: PlayerModel
  ): string {
    const isOverallWinner =
      gamePlayer.id === this.winningPlayerId ? ' overall-winner' : '';

    if (entityBattleResult === undefined) {
      return '' + isOverallWinner;
    }

    return entityBattleResult === -1
      ? 'lost' + isOverallWinner
      : entityBattleResult === 0
      ? 'draw' + isOverallWinner
      : entityBattleResult === 1
      ? 'won' + isOverallWinner
      : '' + isOverallWinner;
  }

  displayRulesDialog(): void {
    this.matDialog.open(RuleDialogComponent);
  }

  private selectRandomEntities(): Observable<
    [CompoundEntityDTO<EntityType>, CompoundEntityDTO<EntityType>]
  > {
    return forkJoin([
      this.restService.fetchRandomEntity(this.getRandomEntityType()),
      this.restService.fetchRandomEntity(
        this.resourceKindControl.value === 'anything'
          ? this.getRandomEntityType()
          : this.resourceKindControl.value
      ),
    ]).pipe(
      map(randomEntities => {
        const compareResult = EntityComparator.compareValues(...randomEntities);

        randomEntities.forEach(
          (entity, index) => (entity.battleResult = compareResult[index])
        );
        return randomEntities;
      })
    );
  }

  private displayErrorMessage(
    message: string,
    action: string = 'Close',
    durationInMs: number = 6000
  ): void {
    this.matSnackBar.open(message, action, {
      duration: durationInMs,
    });
  }

  private getRandomEntityType(): EntityType {
    return Math.ceil(Math.random() * 10) % 2 === 1 ? 'people' : 'starships';
  }

  private observePlayers(): void {
    this.players$.subscribe(players => {
      this.gamePlayers = players;
    });
  }

  private observeWinningPlayerId(): void {
    this.winningPlayerId$.subscribe(playerId => {
      this.winningPlayerId = playerId;
    });
  }

  private processRandomEntities(
    entities: [CompoundEntityDTO<EntityType>, CompoundEntityDTO<EntityType>]
  ): void {
    const battleResults = entities.map(entity => entity.battleResult);
    const gamePlayersToUpdate = this.gamePlayers.map((player, index) => ({
      id: player.id,
      roundWons: player.roundWons + (battleResults[index] === 1 ? 1 : 0),
      roundLost: player.roundLost + (battleResults[index] === -1 ? 1 : 0),
      roundTied: player.roundTied + (battleResults[index] === 0 ? 1 : 0),
    }));

    gamePlayersToUpdate.forEach(player =>
      this.store.dispatch(
        new UpdatePlayerScore(
          player.id,
          player.roundWons,
          player.roundLost,
          player.roundTied
        )
      )
    );
    this.entityList = entities;
    this.isFirstGame = false;
    this.isLoading = false;
  }
}
