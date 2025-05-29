import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {
  Grade,
  GradeCreate,
  GradeCreated,
  GradeModify,
} from '../@shared/models/grade.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private readonly apiUrl = `${environment.apiUrl}/grades`;
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  createForm(): FormGroup {
    return this.fb.group({
      symbolicGrade: ['', Validators.required],
      minPercentage: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      maxPercentage: [{ disabled: true, value: null }, []],
      descriptiveGrade: [''],
    });
  }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl);
  }

  getGradeById(gradeId: string): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/${gradeId}`);
  }

  createGrade(grade: GradeCreate): Observable<GradeCreated> {
    return this.http.post<GradeCreated>(this.apiUrl, grade);
  }

  updateGrade(gradeId: string, grade: GradeModify): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${gradeId}`, grade);
  }

  deleteGrade(gradeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${gradeId}`);
  }
}
