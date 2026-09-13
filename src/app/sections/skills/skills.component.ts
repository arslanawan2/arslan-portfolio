import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SKILL_GROUPS } from '../../core/data/portfolio.data';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [IconComponent, RevealDirective, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  protected readonly groups = SKILL_GROUPS;
}
