import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ACHIEVEMENTS } from '../../core/data/portfolio.data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { TiltDirective } from '../../core/directives/tilt.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [IconComponent, RevealDirective, TiltDirective, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss',
})
export class AchievementsComponent {
  protected readonly achievements = ACHIEVEMENTS;

  /** The six services called out in the CV's achievements. */
  protected readonly services = ['Stripe', 'Firebase', 'Twilio', 'TalkJS', 'DoseSpot', '1Merchant'];
}
