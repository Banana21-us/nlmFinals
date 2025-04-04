import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';
import { errorInterceptor } from './error.interceptor';

import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  // providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideAnimationsAsync()]
  providers: [
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
      provideZoneChangeDetection({ eventCoalescing: true }),provideRouter (routes), provideClientHydration(withEventReplay()),
      provideHttpClient (withFetch(),withInterceptors ([tokenInterceptor, errorInterceptor])), provideAnimationsAsync (),
              ]
              
};

