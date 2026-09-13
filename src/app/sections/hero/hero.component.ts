import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { MARQUEE_ITEMS, METRICS, PROFILE } from '../../core/data/portfolio.data';
import { CountUpDirective } from '../../core/directives/count-up.directive';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { ScrollService } from '../../core/services/scroll.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [IconComponent, RevealDirective, CountUpDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollService = inject(ScrollService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly profile = PROFILE;
  protected readonly metrics = METRICS;
  /** Duplicated so the marquee can loop seamlessly at -50%. */
  protected readonly marquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  /** Index of the role currently shown in the rotator. */
  protected readonly roleIndex = signal(0);

  ngOnInit(): void {
    if (!this.isBrowser || this.profile.roles.length < 2) {
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Rotate the job title every 2.6s, outside Angular so the
    // timer itself does not schedule change detection.
    this.zone.runOutsideAngular(() => {
      const id = setInterval(() => {
        this.zone.run(() => this.roleIndex.update((i) => (i + 1) % this.profile.roles.length));
      }, 2600);
      this.destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  protected go(id: string): void {
    this.scrollService.scrollTo(id);
  }
}
