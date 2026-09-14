import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { NAV_ITEMS } from './core/data/portfolio.data';
import { ScrollService } from './core/services/scroll.service';
import { ThemeService } from './core/services/theme.service';
import { AboutComponent } from './sections/about/about.component';
import { AchievementsComponent } from './sections/achievements/achievements.component';
import { ContactComponent } from './sections/contact/contact.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { FooterComponent } from './sections/footer/footer.component';
import { HeroComponent } from './sections/hero/hero.component';
import { NavbarComponent } from './sections/navbar/navbar.component';
import { SkillsComponent } from './sections/skills/skills.component';
import { AmbientComponent } from './shared/ambient/ambient.component';
import { HireDialogComponent } from './shared/hire-dialog/hire-dialog.component';
import { IntroComponent } from './shared/intro/intro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Components used only inside @defer blocks are code-split
  // automatically — they still have to be listed here.
  imports: [
    AmbientComponent,
    IntroComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    SkillsComponent,
    AchievementsComponent,
    ContactComponent,
    FooterComponent,
    HireDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly scrollService = inject(ScrollService);
  private readonly destroyRef = inject(DestroyRef);

  // Instantiated here so the theme is applied as early as possible.
  private readonly theme = inject(ThemeService);

  /** Holds the page back until the intro curtain lifts, so the
   *  hero's entrance is not spent behind the overlay. */
  protected readonly ready = signal(false);

  ngOnInit(): void {
    // Deferred sections mount later; observe on the next frame so
    // their anchor elements exist before the observer looks.
    requestAnimationFrame(() => {
      this.scrollService.observeSections(NAV_ITEMS.map((n) => n.id));
    });

    // Failsafe: the shell starts hidden and is revealed by the
    // intro's `completed` output. If that never arrives the page
    // would stay blank, so reveal it regardless.
    const failsafe = setTimeout(() => this.ready.set(true), 4000);
    this.destroyRef.onDestroy(() => clearTimeout(failsafe));
  }

  protected onIntroDone(): void {
    this.ready.set(true);
  }
}
