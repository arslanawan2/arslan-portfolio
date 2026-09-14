import { Pipe, type PipeTransform, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

/** Escapes text before it is re-inserted as HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes regex metacharacters in a literal search term. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Wraps the given substrings in <mark> so achievements and metrics
 * stand out inside a bullet.
 *
 * Both the source text and the terms are escaped first, and the
 * only markup ever produced is the <mark> tag this pipe adds — so
 * the result is safe to trust.
 */
@Pipe({ name: 'emphasize', standalone: true })
export class EmphasizePipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(text: string, terms: readonly string[] = []): SafeHtml {
    let out = escapeHtml(text);

    for (const term of terms) {
      if (!term) {
        continue;
      }
      const pattern = new RegExp(escapeRegExp(escapeHtml(term)), 'g');
      out = out.replace(pattern, (match) => `<mark class="mk">${match}</mark>`);
    }

    return this.sanitizer.bypassSecurityTrustHtml(out);
  }
}
