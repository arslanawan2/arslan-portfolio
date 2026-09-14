import { TestBed } from '@angular/core/testing';
import { FALLBACK } from '../../core/data/chat.data';
import { PROFILE } from '../../core/data/portfolio.data';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let svc: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(ChatService);
  });

  it('routes contact questions to the real details', () => {
    const reply = svc.resolve('How can I contact you?');
    expect(reply.text).toContain(PROFILE.email);
    expect(reply.text).toContain(PROFILE.phone);
  });

  it('answers availability questions affirmatively', () => {
    expect(svc.resolve('are you available for hire?').text).toContain('open to Frontend');
  });

  it('answers skills questions with the real stack', () => {
    const text = svc.resolve('what technologies do you know').text;
    expect(text).toContain('Angular');
    expect(text).toContain('TypeScript');
  });

  it('answers experience questions with the employer', () => {
    expect(svc.resolve('tell me about your work experience').text).toContain('Z-Axiss');
  });

  it('answers location questions', () => {
    expect(svc.resolve('where are you based?').text).toContain(PROFILE.location);
  });

  it('is case and punctuation insensitive', () => {
    const a = svc.resolve('SKILLS').text;
    const b = svc.resolve('skills?').text;
    expect(a).toBe(b);
  });

  it('falls back gracefully on an unknown question', () => {
    const reply = svc.resolve('what is the weather on mars');
    expect(reply.text).toBe(FALLBACK);
  });

  it('falls back on empty input without throwing', () => {
    expect(() => svc.resolve('   ')).not.toThrow();
    expect(svc.resolve('   ').text).toBe(FALLBACK);
  });

  it('prefers the more specific intent when keywords overlap', () => {
    // "contact" and "email" both appear; both route to contact.
    expect(svc.resolve('what is your email address').text).toContain(PROFILE.email);
  });
});
