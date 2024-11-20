import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-rule-dialog',
  standalone: true,
  templateUrl: './rule-dialog.component.html',
  styleUrl: './rule-dialog.component.scss',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuleDialogComponent {}
