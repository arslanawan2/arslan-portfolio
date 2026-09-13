import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EDUCATION, LANGUAGES, PROFILE } from '../../core/data/portfolio.data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';

interface Pillar {
  readonly icon: string;
  readonly title: string;
  readonly body: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [IconComponent, RevealDirective, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  protected readonly profile = PROFILE;
  protected readonly education = EDUCATION;
  protected readonly languages = LANGUAGES;

  /** Framing of the CV's themes — domains, performance, integrations. */
  protected readonly pillars: readonly Pillar[] = [
    {
      icon: 'layers',
      title: 'Integration-dense platforms',
      body: 'Healthcare, fintech and enterprise AI governance — multi-portal telehealth, real-time analytics and HIPAA / SOC 2 / GDPR-aligned interfaces.',
    },
    {
      icon: 'gauge',
      title: 'Performance as a feature',
      body: 'Lazy loading, route-level code splitting and change detection tuning — 35%+ faster production apps and ~40% quicker data-heavy pages.',
    },
    {
      icon: 'flow',
      title: 'Modern Angular, early',
      body: 'Led adoption of Signals and Standalone Components across active projects, cutting boilerplate by roughly 25% in shared modules.',
    },
  ];
}
