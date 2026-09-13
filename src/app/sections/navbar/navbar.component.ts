import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NAV_ITEMS, PROFILE } from '../../core/data/portfolio.data';
import { ScrollService } from '../../core/services/scroll.service';
import { ThemeService } from '../../core/services/theme.service';
import { HireDialogService } from '../../shared/hire-dialog/hire-dialog.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly scrollService = inject(ScrollService);
  private readonly hire = inject(HireDialogService);
  protected readonly theme = inject(ThemeService);

  protected readonly navItems = NAV_ITEMS;
  protected readonly profile = PROFILE;

  protected readonly progress = this.scrollService.progress;
  protected readonly scrolled = this.scrollService.scrolled;
  protected readonly active = this.scrollService.activeSection;

  protected readonly menuOpen = signal(false);

  protected go(id: string): void {
    this.menuOpen.set(false);
    this.scrollService.scrollTo(id);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected openHire(): void {
    this.menuOpen.set(false);
    this.hire.open();
  }
}
