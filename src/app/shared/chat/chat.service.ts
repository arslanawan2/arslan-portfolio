import { Injectable } from '@angular/core';
import { FALLBACK, INTENTS, type Intent } from '../../core/data/chat.data';

export interface ChatReply {
  readonly text: string;
  readonly followUps: readonly string[];
}

/**
 * Static intent matcher.
 *
 * Scores each intent by how many of its keywords appear in the
 * question, preferring longer keyword matches so that a specific
 * phrase ("open to") beats an incidental word. Entirely local —
 * no network call, no model.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  resolve(question: string): ChatReply {
    const q = question.toLowerCase().trim();
    if (!q) {
      return { text: FALLBACK, followUps: [] };
    }

    let best: Intent | null = null;
    let bestScore = 0;

    for (const intent of INTENTS) {
      let score = 0;
      for (const kw of intent.keywords) {
        if (q.includes(kw)) {
          // Longer keywords are more specific, so weight them higher.
          score += kw.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    }

    if (!best) {
      return { text: FALLBACK, followUps: ['What experience do you have?', 'How can I contact you?'] };
    }

    return { text: best.answer(), followUps: best.followUps ?? [] };
  }
}
