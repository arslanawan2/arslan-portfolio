import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, NgZone, OnDestroy, PLATFORM_ID, inject, input } from '@angular/core';

/**
 * Pointer-reactive 3D tilt with a spotlight that follows the cursor.
 *
 * All listeners are bound outside Angular and write straight to CSS
 * custom properties, so a moving mouse never triggers change
 * detection. Skipped entirely for touch and reduced-motion users.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Maximum rotation in degrees on each axis. */
  readonly tiltMax = input(6);
  /** Scale applied while hovered. */
  readonly tiltScale = input(1.012);

  private frame = 0;
  private enabled = false;

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    // Tilt is a pointer affordance — pointless on touch, unwanted
    // when the visitor has asked for reduced motion.
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) {
      return;
    }

    this.enabled = true;
    const node = this.el.nativeElement;

    this.zone.runOutsideAngular(() => {
      node.addEventListener('pointermove', this.onMove);
      node.addEventListener('pointerleave', this.onLeave);
    });
  }

  private readonly onMove = (event: PointerEvent): void => {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }

    this.frame = requestAnimationFrame(() => {
      const node = this.el.nativeElement;
      const rect = node.getBoundingClientRect();

      // Normalise pointer position to -0.5 … 0.5 on both axes.
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const max = this.tiltMax();

      node.style.setProperty('--tilt-x', `${(0.5 - py) * max * 2}deg`);
      node.style.setProperty('--tilt-y', `${(px - 0.5) * max * 2}deg`);
      node.style.setProperty('--tilt-scale', `${this.tiltScale()}`);
      // Spotlight origin, consumed by the card's ::after layer.
      node.style.setProperty('--spot-x', `${px * 100}%`);
      node.style.setProperty('--spot-y', `${py * 100}%`);
      node.style.setProperty('--spot-opacity', '1');
      this.frame = 0;
    });
  };

  private readonly onLeave = (): void => {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
    const node = this.el.nativeElement;
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
    node.style.setProperty('--tilt-scale', '1');
    node.style.setProperty('--spot-opacity', '0');
  };

  ngOnDestroy(): void {
    if (!this.enabled) {
      return;
    }
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
    const node = this.el.nativeElement;
    node.removeEventListener('pointermove', this.onMove);
    node.removeEventListener('pointerleave', this.onLeave);
  }
}
