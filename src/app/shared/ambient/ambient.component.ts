import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Backdrop: a ruled column grid, one low glow anchored behind the
 * hero, and a grain layer. Decorative and inert.
 *
 * Deliberately restrained — the drifting colour blobs this used to
 * draw are the single most recognisable "portfolio template" cue.
 */
@Component({
  selector: 'app-ambient',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="amb" aria-hidden="true">
      <div class="amb__cols">
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="amb__glow"></div>
      <div class="amb__grain"></div>
    </div>
  `,
  styleUrl: './ambient.component.scss',
})
export class AmbientComponent {}
