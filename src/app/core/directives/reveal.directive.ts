import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  inject,
  input,
} from '@angular/core';

export type RevealKind = '' | 'left' | 'right' | 'scale' | 'mask';

/**
 * Reveals an element the first time it enters the viewport.
 *
 * One IntersectionObserver per element, disconnected immediately
 * after firing — nothing keeps observing once the work is done.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { '[attr.data-reveal]': 'appReveal()' },
})
export class RevealDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Direction/style of the entrance. */
  readonly appReveal = input<RevealKind>('');
  /** Stagger in ms, applied as a CSS transition-delay. */
  readonly revealDelay = input(0);

  private observer?: IntersectionObserver;

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    // No observer support, or motion is unwelcome → show immediately.
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => this.show());
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.show();
            this.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      this.observer.observe(this.el.nativeElement);
    });
  }

  private show(): void {
    const node = this.el.nativeElement;
    const delay = this.revealDelay();
    if (delay) {
      // Consumed by the [data-reveal] transition-delay.
      this.renderer.setStyle(node, '--rv-delay', `${delay}ms`);
    }
    this.renderer.addClass(node, 'is-visible');
  }

  private disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
