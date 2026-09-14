import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="head" [class.head--center]="center()">
      <p class="eyebrow" appReveal>{{ eyebrow() }}</p>
      <h2 class="head__title" appReveal [revealDelay]="70">
        {{ title() }}
        @if (accent()) {
          <span class="gradient-text">{{ accent() }}</span>
        }
      </h2>
      @if (lead()) {
        <p class="head__lead" appReveal [revealDelay]="140">{{ lead() }}</p>
      }
    </header>
  `,
  styleUrl: './section-heading.component.scss',
})
export class SectionHeadingComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  /** Optional trailing words rendered in the brand gradient. */
  readonly accent = input('');
  readonly lead = input('');
  readonly center = input(false);
}
