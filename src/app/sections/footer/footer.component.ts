import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NAV_ITEMS, PROFILE } from '../../core/data/portfolio.data';
import { ScrollService } from '../../core/services/scroll.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly scrollService = inject(ScrollService);

  protected readonly profile = PROFILE;
  protected readonly navItems = NAV_ITEMS;
  protected readonly year = new Date().getFullYear();

  protected go(id: string): void {
    this.scrollService.scrollTo(id);
  }
}
