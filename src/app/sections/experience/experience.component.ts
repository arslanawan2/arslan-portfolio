import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ROLES } from '../../core/data/portfolio.data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { EmphasizePipe } from '../../core/pipes/emphasize.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [IconComponent, RevealDirective, SectionHeadingComponent, EmphasizePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent {
  protected readonly roles = ROLES;
}
