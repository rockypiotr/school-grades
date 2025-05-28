import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ConflictResponse,
  Grade,
  GradeCreate,
  GradeCreated,
  GradeModify,
} from '../../@shared/models/grade.model';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private readonly apiUrl = `${environment.apiUrl}/grades`;

  constructor(private readonly http: HttpClient) {}

  getGrades(): Observable<Grade[]> {
    return this.http
      .get<Grade[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getGradeById(gradeId: string): Observable<Grade> {
    return this.http
      .get<Grade>(`${this.apiUrl}/${gradeId}`)
      .pipe(catchError(this.handleError));
  }

  createGrade(grade: GradeCreate): Observable<GradeCreated> {
    return this.http
      .post<GradeCreated>(this.apiUrl, grade)
      .pipe(catchError(this.handleError));
  }

  updateGrade(gradeId: string, grade: GradeModify): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/${gradeId}`, grade)
      .pipe(catchError(this.handleError));
  }

  deleteGrade(gradeId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${gradeId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 409 && error.error?.errorCode) {
      return throwError(() => error.error as ConflictResponse);
    }

    if (error.error?.errorCode) {
      return throwError(() => error.error as ConflictResponse);
    }

    return throwError(() => new Error('Unknown error'));
  }
}
