import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Grade,
  GradeCreate,
  GradeModify,
} from '../../../@shared/models/grade.model';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatButton } from '@angular/material/button';
import { GradeService } from '../../../service/grade.service';

@Component({
  selector: 'app-grade-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatError,
    MatFormField,
    MatLabel,
    CdkTextareaAutosize,
    MatInput,
    MatButton,
    MatSuffix,
  ],
  templateUrl: './grade-form.component.html',
  styleUrl: './grade-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradeFormComponent implements OnInit {
  currentGrade = input<Grade | null | undefined>();
  currentGradeMaxPercentage = input<number | undefined | null>();

  save = output<GradeCreate | GradeModify>();
  cancel = output<void>();

  gradeForm!: FormGroup;

  private gradeEffect = effect(() => this.updateGradeForm());
  private readonly gradeService = inject(GradeService);

  constructor() {}

  ngOnInit() {
    this.createForm();
  }

  onSubmit(): void {
    this.validateForm();
    this.save.emit(this.getPayload());
  }

  private getPayload(): GradeCreate | GradeModify {
    const formValue = this.gradeForm.value;
    return {
      symbolicGrade: formValue.symbolicGrade,
      minPercentage: Number(formValue.minPercentage),
      descriptiveGrade: formValue.descriptiveGrade || undefined,
    };
  }

  private validateForm() {
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      throw new Error('Invalid form');
    }
  }

  private createForm() {
    this.gradeForm = this.gradeService.createForm();
  }

  private updateGradeForm() {
    const grade = this.currentGrade();

    if (grade) {
      this.gradeForm.patchValue({
        minPercentage: grade.minPercentage,
        maxPercentage: this.currentGradeMaxPercentage(),
        symbolicGrade: grade.symbolicGrade,
        descriptiveGrade: grade.descriptiveGrade || '',
      });
    } else {
      this.gradeForm.reset();
    }
    this.gradeForm.markAsPristine();
    this.gradeForm.markAsUntouched();
  }
}
