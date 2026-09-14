import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { PROFILE } from '../../core/data/portfolio.data';
import { HireDialogService } from '../../shared/hire-dialog/hire-dialog.service';
import { RevealDirective } from '../../core/directives/reveal.directive';
import { IconComponent } from '../../shared/icon/icon.component';
import { SectionHeadingComponent } from '../../shared/section-heading/section-heading.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [IconComponent, RevealDirective, SectionHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly hire = inject(HireDialogService);

  protected readonly profile = PROFILE;

  /** Precomputed so the template never calls a method during CD. */
  protected readonly telHref = `tel:${PROFILE.phone.replace(/\s+/g, '')}`;

  /** Which field was just copied, for the inline confirmation. */
  protected readonly copied = signal<string | null>(null);

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  protected openHire(): void {
    this.hire.open();
  }

  protected async copy(value: string, key: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.copied.set(key);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.copied.set(null), 2000);
    } catch {
      // Clipboard blocked (insecure origin or denied permission) —
      // the value is still visible and selectable on screen.
    }
  }
}
