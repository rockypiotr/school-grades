import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { DisplayGrade, Grade } from '../../../@shared/models/grade.model';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatList, MatListItem } from '@angular/material/list';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-grade-list',
  imports: [
    CommonModule,
    MatIcon,
    MatButton,
    MatList,
    MatListItem,
    MatIconButton,
    MatRipple,
  ],
  templateUrl: './grade-list.component.html',
  styleUrl: './grade-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeListComponent {
  grades = input.required<DisplayGrade[]>();
  selectGrade = output<Grade>();
  deleteGrade = output<string>();
  addGrade = output<void>();

  removeItem(event: MouseEvent, gradeId: string): void {
    event.stopPropagation();
    this.deleteGrade.emit(gradeId);
  }
}
