import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PROFILE } from '../../core/data/portfolio.data';
import { IconComponent } from '../icon/icon.component';
import { HireDialogService } from './hire-dialog.service';

/**
 * "Hire me" panel.
 *
 * A bare mailto: silently does nothing when no mail client is
 * registered — which is what made the old button feel broken.
 * This composes the message, then offers three routes that
 * always work: open the mail client, copy the address, or copy
 * the whole drafted message.
 */
@Component({
  selector: 'app-hire-dialog',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hire-dialog.component.html',
  styleUrl: './hire-dialog.component.scss',
})
export class HireDialogComponent {
  private readonly dialog = inject(HireDialogService);
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  protected readonly profile = PROFILE;
  protected readonly isOpen = this.dialog.isOpen;

  protected readonly name = signal('');
  protected readonly company = signal('');
  protected readonly message = signal('');
  protected readonly copied = signal<string | null>(null);

  private copyTimer?: ReturnType<typeof setTimeout>;
  private lastFocused: HTMLElement | null = null;

  protected readonly subject = computed(() => {
    const who = this.company().trim();
    return who ? `Frontend role at ${who}` : 'Frontend opportunity';
  });

  /** The drafted email, used for both mailto and clipboard. */
  protected readonly body = computed(() => {
    const lines = [`Hi Arslan,`, ''];
    const msg = this.message().trim();
    lines.push(msg || 'I came across your portfolio and would like to talk about a role.');
    lines.push('', '—', this.name().trim() || 'Your name');
    if (this.company().trim()) {
      lines.push(this.company().trim());
    }
    return lines.join('\n');
  });

  protected readonly mailto = computed(
    () =>
      `mailto:${PROFILE.email}?subject=${encodeURIComponent(this.subject())}&body=${encodeURIComponent(this.body())}`,
  );

  protected readonly whatsapp = computed(() => {
    const digits = PROFILE.phone.replace(/[^\d]/g, '');
    return `https://wa.me/${digits}?text=${encodeURIComponent(this.body())}`;
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.copyTimer);
      this.doc.body.classList.remove('is-locked');
    });

    effect(() => {
      if (!this.isBrowser) {
        return;
      }
      if (this.isOpen()) {
        this.lastFocused = this.doc.activeElement as HTMLElement | null;
        this.doc.body.classList.add('is-locked');
        // Wait for the panel to exist before moving focus into it.
        queueMicrotask(() => this.panel()?.nativeElement.focus());
      } else {
        this.doc.body.classList.remove('is-locked');
        this.lastFocused?.focus?.();
        this.lastFocused = null;
      }
    });
  }

  protected close(): void {
    this.dialog.close();
  }

  /** Keeps focus inside the panel while it is open. */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }

    const host = this.panel()?.nativeElement;
    if (!host) {
      return;
    }
    const focusable = Array.from(
      host.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);

    if (focusable.length === 0) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.doc.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected async copy(value: string, key: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
      this.copied.set(key);
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => this.copied.set(null), 2200);
    } catch {
      // Clipboard unavailable — the address is on screen to select.
    }
  }
}
