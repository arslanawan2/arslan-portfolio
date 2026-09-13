import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';

export type ThemeChoice = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'aa-theme';

/**
 * Signal-based theme store.
 *
 * `choice` is what the user picked (including "system"); `resolved`
 * is what actually renders. An effect mirrors `resolved` onto
 * <html data-theme> so the CSS token layer does the real work.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Tracks the OS preference so "system" stays live. */
  private readonly systemPrefersDark = signal(false);

  private readonly choiceState = signal<ThemeChoice>('system');

  readonly choice = this.choiceState.asReadonly();

  readonly resolved = computed<ResolvedTheme>(() => {
    const c = this.choiceState();
    if (c === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }
    return c;
  });

  readonly isDark = computed(() => this.resolved() === 'dark');

  constructor() {
    if (this.isBrowser) {
      this.restore();
      this.watchSystem();
    }

    effect(() => {
      const theme = this.resolved();
      if (!this.isBrowser) {
        return;
      }
      const root = this.doc.documentElement;
      root.setAttribute('data-theme', theme);
      // Keep the browser UI (form controls, scrollbars) in step.
      root.style.colorScheme = theme;
      this.doc
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', theme === 'dark' ? '#07090c' : '#fbfcfd');
    });
  }

  /** Cycles light → dark → light. "system" resolves first. */
  toggle(): void {
    const next: ThemeChoice = this.resolved() === 'dark' ? 'light' : 'dark';
    this.set(next);
  }

  set(choice: ThemeChoice): void {
    this.choiceState.set(choice);
    if (!this.isBrowser) {
      return;
    }
    try {
      if (choice === 'system') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, choice);
      }
    } catch {
      // Private mode / blocked storage — the in-memory signal still works.
    }
  }

  private restore(): void {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === 'light' || stored === 'dark') {
      this.choiceState.set(stored);
    }
  }

  private watchSystem(): void {
    const mq = this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)');
    if (!mq) {
      return;
    }
    this.systemPrefersDark.set(mq.matches);
    mq.addEventListener('change', (e) => this.systemPrefersDark.set(e.matches));
  }
}
