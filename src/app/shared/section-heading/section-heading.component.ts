import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="head">
      <p class="sec-tag" appReveal><b>{{ index() }}</b> {{ eyebrow() }}</p>
      <div class="head__body">
        <h2 class="head__title" appReveal="mask" [revealDelay]="60">
          <span
            >{{ title() }}
            @if (accent()) {
              <em class="serif">{{ accent() }}</em>
            }</span
          >
        </h2>
        @if (lead()) {
          <p class="head__lead" appReveal [revealDelay]="160">{{ lead() }}</p>
        }
      </div>
    </header>
  `,
  styleUrl: './section-heading.component.scss',
})
export class SectionHeadingComponent {
  /** Two-digit section number, e.g. "01". */
  readonly index = input.required<string>();
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  /** Trailing words set in the serif italic. */
  readonly accent = input('');
  readonly lead = input('');
}
