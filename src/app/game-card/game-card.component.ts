import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CompoundEntityDTO, EntityType } from '../types/entity.types';
import { DatePipe, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlayerModel } from '../infrastructure/models/player.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgFor,
    DatePipe,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
  @Input()
  entity?: CompoundEntityDTO<EntityType>;

  @Input()
  isFirstGame: boolean = true;

  @Input({ required: true })
  playerModel?: PlayerModel;

  randomSkeletonText: Array<string> = Array(7)
    .fill(0)
    .map(() => (Math.random() + 1).toString(36));

  getEntityEntries(): [string, string][] {
    if (!this.entity) {
      return [];
    }

    return Object.entries(this.entity) as unknown as [string, string][];
  }
}
