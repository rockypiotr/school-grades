import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { GradeMockApiService } from './@shared/mock-api/grade-mock-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      InMemoryWebApiModule.forRoot(GradeMockApiService, {
        delay: 500,
        dataEncapsulation: false,
        passThruUnknownUrl: true,
      }),
    ),
  ],
};
