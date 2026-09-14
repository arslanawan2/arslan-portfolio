import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { STARTER_QUESTIONS } from '../../core/data/chat.data';
import { PROFILE } from '../../core/data/portfolio.data';
import { HireDialogService } from '../hire-dialog/hire-dialog.service';
import { IconComponent } from '../icon/icon.component';
import { ChatService } from './chat.service';

interface Message {
  readonly id: number;
  readonly from: 'bot' | 'user';
  readonly text: string;
  readonly time: string;
}

const TYPING_MS = 550;

/**
 * Floating assistant. Answers from a static, keyword-matched
 * knowledge base built out of the CV data — no API key, no
 * network request, works offline.
 */
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private readonly chat = inject(ChatService);
  private readonly hire = inject(HireDialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly profile = PROFILE;
  protected readonly starters = STARTER_QUESTIONS;

  protected readonly open = signal(false);
  protected readonly typing = signal(false);
  protected readonly draft = signal('');
  protected readonly messages = signal<readonly Message[]>([
    {
      id: 0,
      from: 'bot',
      text: `Hi! I'm Arslan's assistant. Ask me about his experience, skills, projects or how to reach him.`,
      time: nowLabel(),
    },
  ]);

  /** Suggestions under the latest bot reply. */
  protected readonly suggestions = signal<readonly string[]>(STARTER_QUESTIONS);

  /** Nudges the launcher once, so the widget gets noticed. */
  protected readonly hasUnread = signal(true);

  private nextId = 1;
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    this.destroyRef.onDestroy(() => this.timers.forEach(clearTimeout));

    // Keep the transcript pinned to the newest message.
    effect(() => {
      this.messages();
      this.typing();
      if (!this.isBrowser) {
        return;
      }
      queueMicrotask(() => {
        const el = this.scroller()?.nativeElement;
        if (el) {
          el.scrollTop = el.scrollHeight;
        }
      });
    });
  }

  protected toggle(): void {
    const next = !this.open();
    this.open.set(next);
    if (next) {
      this.hasUnread.set(false);
      queueMicrotask(() => this.input()?.nativeElement.focus());
    }
  }

  protected close(): void {
    this.open.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  protected send(text?: string): void {
    const question = (text ?? this.draft()).trim();
    if (!question || this.typing()) {
      return;
    }

    this.push({ from: 'user', text: question });
    this.draft.set('');
    this.suggestions.set([]);
    this.typing.set(true);

    // A short delay so the reply reads as a response, not a jump cut.
    const t = setTimeout(() => {
      const reply = this.chat.resolve(question);
      this.typing.set(false);
      this.push({ from: 'bot', text: reply.text });
      this.suggestions.set(reply.followUps);
    }, TYPING_MS);
    this.timers.push(t);
  }

  protected openHire(): void {
    this.close();
    this.hire.open();
  }

  private push(msg: { from: 'bot' | 'user'; text: string }): void {
    this.messages.update((list) => [...list, { id: this.nextId++, ...msg, time: nowLabel() }]);
  }
}

function nowLabel(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
