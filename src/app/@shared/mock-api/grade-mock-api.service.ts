import { Injectable } from '@angular/core';
import {
  InMemoryDbService,
  RequestInfo,
  STATUS,
} from 'angular-in-memory-web-api';
import {
  ConflictResponse,
  Grade,
  GradeCreate,
  GradeCreated,
  GradeModify,
} from '../models/grade.model';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class GradeMockApiService implements InMemoryDbService {
  private grades: Grade[] = [
    {
      id: 'ungr-0e0668e7-e907-4c7d-8af9-a0a4a37f6d82',
      minPercentage: 0,
      symbolicGrade: 'Good',
      descriptiveGrade:
        'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    },
    {
      id: 'ungr-2ebf3a08-6246-4005-a2b4-6d8b3d9349c2',
      minPercentage: 50,
      symbolicGrade: 'Very Good',
    },
  ];

  createDb(reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
    return { grades: this.grades };
  }

  generateId(): string {
    return `ungr-${uuidv4()}`;
  }

  post(reqInfo: RequestInfo): Observable<any> {
    const collectionName = reqInfo.collectionName;

    if (collectionName === 'grades') {
      const newGradeData = reqInfo.utils.getJsonBody(
        reqInfo.req,
      ) as GradeCreate;
      const conflictExists = this.grades.some(
        (grade) => grade.minPercentage === newGradeData.minPercentage,
      );

      if (conflictExists) {
        const conflictBody: ConflictResponse = {
          errorCode: 'AS014',
          errorMessage: 'Minimum percentage value is already used!',
        };
        return reqInfo.utils.createResponse$(() => ({
          body: conflictBody,
          status: STATUS.CONFLICT,
          headers: reqInfo.headers,
          url: reqInfo.url,
        }));
      }

      const newId = this.generateId();
      const gradeToAdd: Grade = {
        id: newId,
        minPercentage: newGradeData.minPercentage,
        symbolicGrade: newGradeData.symbolicGrade,
      };
      this.grades.push(gradeToAdd);
      this.grades.sort((a, b) => a.minPercentage - b.minPercentage);

      const createdResponse: GradeCreated = {
        id: gradeToAdd.id,
        minPercentage: gradeToAdd.minPercentage,
        symbolicGrade: gradeToAdd.symbolicGrade,
      };

      return reqInfo.utils.createResponse$(() => ({
        body: createdResponse,
        status: STATUS.CREATED,
        headers: reqInfo.headers,
        url: reqInfo.url,
      }));
    }

    return of(undefined);
  }

  patch(reqInfo: RequestInfo): Observable<any> {
    const collectionName = reqInfo.collectionName;

    if (collectionName === 'grades') {
      const id = reqInfo.id;
      const gradeChanges: GradeModify = reqInfo.utils.getJsonBody(reqInfo.req);
      const collection: Grade[] = reqInfo.collection;

      const gradeIndex = collection.findIndex((grade) => grade.id === id);

      if (gradeIndex === -1) {
        return reqInfo.utils.createResponse$(() => ({
          body: { error: `Grade with id='${id}' not found` },
          status: STATUS.NOT_FOUND,
          headers: reqInfo.headers,
          url: reqInfo.url,
        }));
      }

      if (
        gradeChanges.minPercentage !== undefined &&
        gradeChanges.minPercentage !== collection[gradeIndex].minPercentage
      ) {
        const conflictExists = collection.some(
          (grade) =>
            grade.id !== id &&
            grade.minPercentage === gradeChanges.minPercentage,
        );
        if (conflictExists) {
          const conflictBody: ConflictResponse = {
            errorCode: 'AS015',
            errorMessage:
              'Minimum percentage value is already used by another grade!',
          };
          return reqInfo.utils.createResponse$(() => ({
            body: conflictBody,
            status: STATUS.CONFLICT,
            headers: reqInfo.headers,
            url: reqInfo.url,
          }));
        }
      }

      collection[gradeIndex] = { ...collection[gradeIndex], ...gradeChanges };
      this.grades.sort((a, b) => a.minPercentage - b.minPercentage);

      return reqInfo.utils.createResponse$(() => ({
        status: STATUS.NO_CONTENT,
        headers: reqInfo.headers,
        url: reqInfo.url,
      }));
    }
    return of(undefined);
  }

  delete(reqInfo: RequestInfo): Observable<any> {
    const collectionName = reqInfo.collectionName;
    if (collectionName === 'grades') {
      const id = reqInfo.id;
      const initialLength = this.grades.length;
      this.grades = this.grades.filter((grade) => grade.id !== id);

      if (this.grades.length === initialLength) {
        return reqInfo.utils.createResponse$(() => ({
          status: STATUS.NOT_FOUND,
          headers: reqInfo.headers,
          url: reqInfo.url,
        }));
      }
      return reqInfo.utils.createResponse$(() => ({
        status: STATUS.NO_CONTENT,
        headers: reqInfo.headers,
        url: reqInfo.url,
      }));
    }
    return of(undefined);
  }
}
