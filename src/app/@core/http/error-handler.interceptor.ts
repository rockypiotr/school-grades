import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  const showErrorMessage = (message: string) => {
    snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: 'error-snackbar',
    });
  };

  return next(req).pipe(
    catchError((err) => {
      showErrorMessage(err.body.errorMessage);

      return throwError(() => err);
    }),
  );
};
