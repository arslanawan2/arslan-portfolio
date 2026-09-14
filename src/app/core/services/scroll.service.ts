import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';

/**
 * Tracks scroll progress and the section currently in view.
 *
 * The scroll listener runs outside Angular and only writes to
 * signals inside `NgZone.run`, so passive scrolling never
 * triggers change detection on its own.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** 0 → 1 down the page, for the top progress bar. */
  readonly progress = signal(0);
  /** True once the user has scrolled past the hero threshold. */
  readonly scrolled = signal(false);
  /** id of the section currently occupying the viewport. */
  readonly activeSection = signal('home');

  private ticking = false;
  private observer?: IntersectionObserver;

  constructor() {
    if (!this.isBrowser) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.doc.defaultView?.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  /** Called by the shell once the section elements exist. */
  observeSections(ids: readonly string[]): void {
    if (!this.isBrowser) {
      return;
    }
    this.observer?.disconnect();

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          // Pick the most-visible intersecting section.
          const best = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (best?.target.id) {
            const id = best.target.id;
            if (id !== this.activeSection()) {
              this.zone.run(() => this.activeSection.set(id));
            }
          }
        },
        // A band across the middle of the viewport decides "active".
        { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
      );

      for (const id of ids) {
        const el = this.doc.getElementById(id);
        if (el) {
          this.observer!.observe(el);
        }
      }
    });
  }

  scrollTo(id: string): void {
    const el = this.doc.getElementById(id);
    if (!el) {
      return;
    }
    const reduced = this.doc.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    // Move focus for keyboard/screen-reader users without a visible jump.
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  private readonly onScroll = (): void => {
    if (this.ticking) {
      return;
    }
    this.ticking = true;

    requestAnimationFrame(() => {
      const win = this.doc.defaultView;
      const el = this.doc.documentElement;
      const y = win?.scrollY ?? 0;
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? Math.min(y / max, 1) : 0;
      const isScrolled = y > 24;

      // Only re-enter Angular when a value actually changed.
      if (Math.abs(pct - this.progress()) > 0.001 || isScrolled !== this.scrolled()) {
        this.zone.run(() => {
          this.progress.set(pct);
          this.scrolled.set(isScrolled);
        });
      }
      this.ticking = false;
    });
  };
}
