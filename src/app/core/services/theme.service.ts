import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'aa-theme';

/**
 * Signal-based theme store.
 *
 * Dark is the intended presentation and the default for every
 * first-time visitor; the OS preference is deliberately not
 * consulted. Light is an explicit, remembered opt-in.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly state = signal<Theme>('dark');

  readonly theme = this.state.asReadonly();
  readonly isDark = computed(() => this.state() === 'dark');

  constructor() {
    if (this.isBrowser) {
      this.restore();
    }

    effect(() => {
      const theme = this.state();
      if (!this.isBrowser) {
        return;
      }
      const root = this.doc.documentElement;
      root.setAttribute('data-theme', theme);
      root.style.colorScheme = theme;
      this.doc
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#0a0a0c' : '#f4f0e7');
    });
  }

  toggle(): void {
    this.set(this.state() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.state.set(theme);
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Private mode / blocked storage — the signal still drives the UI.
    }
  }

  private restore(): void {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'light') {
        this.state.set('light');
      }
    } catch {
      // Unreadable storage — keep the dark default.
    }
  }
}
