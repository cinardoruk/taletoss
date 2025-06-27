// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

import { inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import {
  catchError,
  Observable,
  throwError
} from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  // console.log('🔁 Intercepted request:', req);
  const authService = inject(AuthService);
  const router      = inject(Router);

  const token = authService.getToken();
  if (token) {
    // console.log('✅ Response:', event);
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        authService.logout();
        router.navigate(['login']);
      }
      return throwError(() => err);
    })
  );
};
