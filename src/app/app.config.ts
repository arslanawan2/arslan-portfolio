import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Coalescing batches events fired in the same tick into a
    // single change detection pass.
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
};
