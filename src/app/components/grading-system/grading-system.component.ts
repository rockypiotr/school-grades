import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  Grade,
  GradeCreate,
  GradeModify,
} from '../../@shared/models/grade.model';
import { GradeService } from '../../service/grade.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GradeListComponent } from './grade-list/grade-list.component';
import { GradeFormComponent } from './grade-form/grade-form.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  catchError,
  finalize,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-grading-system',
  imports: [GradeListComponent, GradeFormComponent, MatProgressSpinner],
  templateUrl: './grading-system.component.html',
  styleUrl: './grading-system.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradingSystemComponent implements OnInit {
  selectedGradeId = signal<string | null | undefined>(null);
  isLoading = signal(false);
  isFormVisible = signal(false);
  selectedGradeMaxPercentageForForm = computed(() => {
    const selGrade = this.selectedGradeForForm();
    if (!selGrade) return undefined;
    const displayGrade = this.sortedDisplayGrades().find(
      (g) => g.id === selGrade.id,
    );
    return displayGrade?.maxPercentage;
  });
  private readonly gradeService = inject(GradeService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private gradesFromService = signal<Grade[]>([]);
  sortedDisplayGrades = computed(() => {
    const currentGrades = [...this.gradesFromService()];
    currentGrades.sort((a, b) => a.minPercentage - b.minPercentage);
    return currentGrades.map((grade, index, array) => {
      const maxPercentage =
        index === array.length - 1 ? 100 : array[index + 1].minPercentage - 1;
      return { ...grade, maxPercentage };
    });
  });
  selectedGradeForForm = computed(() => {
    const id = this.selectedGradeId();
    if (!id) return null;
    return this.gradesFromService().find((g) => g.id === id) || null;
  });

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.isLoading.set(true);
    this.gradeService
      .getGrades()
      .pipe(
        catchError((err) => {
          this.isLoading.set(false);
          console.error('Failed to load grades', err);
          return throwError(() => err);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((grades) => {
        this.gradesFromService.set(grades);
        this.isLoading.set(false);
      });
  }

  onSelectGrade(grade: Grade): void {
    this.selectedGradeId.set(grade.id);
    this.isFormVisible.set(true);
  }

  onAddNewGrade(): void {
    this.selectedGradeId.set(null);
    this.isFormVisible.set(true);
  }

  onDeleteGrade(gradeId: string): void {
    this.isLoading.set(true);
    this.gradeService
      .deleteGrade(gradeId)
      .pipe(
        tap(() => {
          this.showSnackbar('Grade deleted successfully.', 'success-snackbar');
          if (this.selectedGradeId() === gradeId) {
            this.onCancelForm();
          }
        }),
        switchMap(() => this.gradeService.getGrades()),
        catchError((err) => {
          this.isLoading.set(false);
          console.error('Failed to delete grade', err);
          return throwError(() => err);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((grades) => this.gradesFromService.set(grades));
  }

  onSaveGrade(gradeData: GradeCreate | GradeModify): void {
    this.isLoading.set(true);
    const currentSelectedGrade = this.selectedGradeForForm();

    const operation: Observable<void | GradeCreate> = currentSelectedGrade
      ? this.gradeService.updateGrade(
          currentSelectedGrade.id,
          gradeData as GradeModify,
        )
      : this.gradeService.createGrade(gradeData as GradeCreate);

    operation
      .pipe(
        tap(() => {
          this.showSnackbar(
            `Grade ${currentSelectedGrade ? 'updated' : 'created'} successfully.`,
            'success-snackbar',
          );
          this.isFormVisible.set(false);
          this.selectedGradeId.set(null);
        }),
        switchMap(() => this.gradeService.getGrades()),
        catchError((err) => {
          this.isLoading.set(false);
          console.error('Failed to save grade', err);
          return throwError(() => err);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((grades) => this.gradesFromService.set(grades));
  }

  onCancelForm(): void {
    this.isFormVisible.set(false);
    this.selectedGradeId.set(null);
  }

  private showSnackbar(
    message: string,
    state: 'success-snackbar' | 'error-snackbar',
  ): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      panelClass: state,
    });
  }
}
