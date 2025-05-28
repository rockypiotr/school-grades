export interface Grade {
  id: string;
  minPercentage: number;
  symbolicGrade: string;
  descriptiveGrade?: string;
}

export interface GradeCreate {
  minPercentage: number;
  symbolicGrade: string;
}

export interface GradeCreated {
  id: string;
  minPercentage: number;
  symbolicGrade: string;
}

export interface GradeModify {
  minPercentage?: number;
  symbolicGrade?: string;
  descriptiveGrade?: string;
}

export interface ConflictResponse {
  errorCode: string;
  errorMessage: string;
  errorData?: Record<string, any>;
}
