import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Ambient backdrop: three slowly drifting colour blobs, a fine
 * grid, and a grain layer. Purely decorative and inert to
 * pointer events; it sits behind all content.
 */
@Component({
  selector: 'app-ambient',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ambient" aria-hidden="true">
      <div class="ambient__blob ambient__blob--1"></div>
      <div class="ambient__blob ambient__blob--2"></div>
      <div class="ambient__blob ambient__blob--3"></div>
      <div class="ambient__grid"></div>
      <div class="ambient__grain"></div>
    </div>
  `,
  styleUrl: './ambient.component.scss',
})
export class AmbientComponent {}
