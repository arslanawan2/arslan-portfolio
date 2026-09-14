import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, NgZone, OnDestroy, PLATFORM_ID, inject, input } from '@angular/core';

/**
 * Counts from 0 to `countUp` once the element scrolls into view.
 *
 * Uses an eased rAF loop outside Angular and writes textContent
 * directly — no change detection per frame.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly appCountUp = input.required<number>();
  readonly duration = input(1600);

  private observer?: IntersectionObserver;
  private frame = 0;

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => this.render(this.appCountUp()));
      return;
    }

    // Start at zero so there is no flash of the final value.
    queueMicrotask(() => this.render(0));

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.observer?.disconnect();
            this.observer = undefined;
            this.animate();
          }
        },
        { threshold: 0.5 },
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  private animate(): void {
    const target = this.appCountUp();
    const total = this.duration();
    const start = performance.now();

    const step = (now: number): void => {
      const t = Math.min((now - start) / total, 1);
      // easeOutExpo — fast start, soft landing.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      this.render(Math.round(target * eased));

      if (t < 1) {
        this.frame = requestAnimationFrame(step);
      } else {
        this.frame = 0;
      }
    };

    this.frame = requestAnimationFrame(step);
  }

  private render(value: number): void {
    this.el.nativeElement.textContent = value.toLocaleString('en-US');
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
  }
}
