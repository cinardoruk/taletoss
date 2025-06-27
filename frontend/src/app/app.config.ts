// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorFn } from '@features/auth/auth.interceptor'

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptorFn
      ])
    ),
    provideAnimationsAsync(),
  ]
};
