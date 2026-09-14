import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  OnInit,
  PLATFORM_ID,
  inject,
  output,
  signal,
} from '@angular/core';
import { PROFILE } from '../../core/data/portfolio.data';

const SEEN_KEY = 'aa-intro-seen';

/**
 * Opening curtain: a count to 100 while the name resolves, then
 * the panel lifts away.
 *
 * Shown once per browser session — a returning visitor goes
 * straight to the page. Skipped entirely for reduced-motion
 * users, and dismissable at any point with a click or Escape.
 */
@Component({
  selector: 'app-intro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
  host: {
    '[class.is-done]': 'done()',
    '[attr.aria-hidden]': 'done() ? "true" : null',
    '(document:keydown.escape)': 'finish()',
  },
})
export class IntroComponent implements OnInit {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Emitted once the curtain is fully out of the way. */
  readonly completed = output<void>();

  protected readonly profile = PROFILE;
  protected readonly count = signal(0);
  protected readonly lifting = signal(false);
  protected readonly done = signal(false);

  /** Letters of the name, revealed in sequence. */
  protected readonly letters = PROFILE.name.split('');

  private frame = 0;
  private finished = false;

  ngOnInit(): void {
    if (!this.isBrowser) {
      queueMicrotask(() => this.complete());
      return;
    }

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = false;
    }

    if (reduced || seen) {
      // Emitted off the current tick: `completed` fires during the
      // parent's first change detection otherwise.
      queueMicrotask(() => this.complete());
      return;
    }

    this.doc.body.classList.add('is-locked');
    this.destroyRef.onDestroy(() => this.cleanup());
    this.run();
  }

  /** Click / Escape — jump straight to the end. */
  protected finish(): void {
    if (this.finished || this.done()) {
      return;
    }
    this.count.set(100);
    this.lift();
  }

  private run(): void {
    const duration = 1900;
    const start = performance.now();

    this.zone.runOutsideAngular(() => {
      const step = (now: number): void => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutQuart — races ahead, then settles on 100.
        const eased = 1 - Math.pow(1 - t, 4);
        const value = Math.round(eased * 100);

        this.zone.run(() => this.count.set(value));

        if (t < 1) {
          this.frame = requestAnimationFrame(step);
        } else {
          this.frame = 0;
          this.zone.run(() => this.lift());
        }
      };
      this.frame = requestAnimationFrame(step);
    });
  }

  private lift(): void {
    if (this.finished) {
      return;
    }
    this.finished = true;
    this.cancelFrame();
    this.lifting.set(true);

    // Matches the curtain transition in the stylesheet.
    const id = setTimeout(() => this.complete(), 1100);
    this.destroyRef.onDestroy(() => clearTimeout(id));
  }

  private complete(): void {
    this.done.set(true);
    this.cleanup();
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Non-fatal: the intro simply plays again next visit.
    }
    this.completed.emit();
  }

  private cancelFrame(): void {
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  private cleanup(): void {
    this.cancelFrame();
    this.doc.body.classList.remove('is-locked');
  }
}
