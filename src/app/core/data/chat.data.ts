import { ACHIEVEMENTS, EDUCATION, LANGUAGES, PROFILE, ROLES, SKILL_GROUPS } from './portfolio.data';

/** One answerable topic. Matching is keyword-based — no network,
 *  no model; every answer is derived from the CV data above. */
export interface Intent {
  readonly id: string;
  /** Lowercase terms that route a question to this intent. */
  readonly keywords: readonly string[];
  /** Built lazily so it always reflects the portfolio data. */
  readonly answer: () => string;
  /** Follow-ups offered after this answer. */
  readonly followUps?: readonly string[];
}

/** Chips shown when the chat is first opened. */
export const STARTER_QUESTIONS: readonly string[] = [
  'What experience do you have?',
  'Which technologies do you know?',
  'Are you available for hire?',
  'How can I contact you?',
];

const list = (items: readonly string[]): string => items.join(', ');

export const INTENTS: readonly Intent[] = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'salam', 'assalam', 'good morning', 'good evening', 'yo'],
    answer: () =>
      `Hello! I'm Arslan's assistant. I can tell you about his experience, skills, projects, education or how to get in touch.`,
    followUps: ['What experience do you have?', 'Which technologies do you know?'],
  },
  {
    id: 'experience',
    keywords: ['experience', 'work', 'job', 'career', 'role', 'company', 'employer', 'zaxiss', 'z-axiss', 'years'],
    answer: () => {
      const r = ROLES[0];
      return `${PROFILE.name} has 3 years of professional experience. He's currently ${r.title} at ${r.company} (${r.period}), where he:\n\n${r.highlights
        .slice(0, 4)
        .map((h) => `• ${h.text}`)
        .join('\n\n')}`;
    },
    followUps: ['What did you build at Z-Axiss?', 'Which technologies do you know?'],
  },
  {
    id: 'projects',
    keywords: ['project', 'built', 'build', 'portfolio', 'telehealth', 'dashboard', 'platform', 'governance', 'app'],
    answer: () =>
      `Main projects:\n\n• Multi-role telehealth system — 4 portals for patients, providers, pharmacies and labs, serving 500+ daily active users.\n\n• Analytics migration — 5+ business reports with 60+ real-time graphs moved from Looker Studio to custom Angular with Chart.js and Apache ECharts, cutting load time ~40%.\n\n• Generative AI Governance Platform — policy control UI and compliance dashboards aligned to HIPAA, SOC 2 and GDPR, supporting 3 enterprise clients at launch.\n\n• AI-driven business acquisition platform — Stripe subscriptions and Firebase push notifications across 10+ countries.`,
    followUps: ['Are you available for hire?', 'What are your achievements?'],
  },
  {
    id: 'skills',
    keywords: [
      'skill',
      'tech',
      'technology',
      'stack',
      'angular',
      'typescript',
      'rxjs',
      'signals',
      'know',
      'language',
      'framework',
      'tool',
    ],
    answer: () =>
      `Here's the toolkit:\n\n${SKILL_GROUPS.map((g) => `• ${g.title}: ${list(g.skills)}`).join('\n\n')}`,
    followUps: ['What experience do you have?', 'How can I contact you?'],
  },
  {
    id: 'achievements',
    keywords: ['achievement', 'accomplish', 'proud', 'impact', 'award', 'highlight', 'best'],
    answer: () => ACHIEVEMENTS.map((a) => `• ${a.title}\n  ${a.detail}`).join('\n\n'),
    followUps: ['What experience do you have?', 'Are you available for hire?'],
  },
  {
    id: 'performance',
    keywords: ['performance', 'optimiz', 'optimis', 'fast', 'speed', 'lazy', 'bundle', 'load'],
    answer: () =>
      `Performance is a focus area. On production apps he improved performance by 35%+ using lazy loading, route-level code splitting and Angular change detection optimization — and cut average page load time by ~40% when migrating 60+ real-time graphs off Looker Studio.\n\nThis very portfolio is built the same way: standalone components, Signals, deferred (@defer) sections and an ~83 kB gzipped initial bundle.`,
    followUps: ['Which technologies do you know?', 'What are your achievements?'],
  },
  {
    id: 'education',
    keywords: ['education', 'degree', 'university', 'study', 'studied', 'college', 'graduate', 'qualification'],
    answer: () => `${EDUCATION.degree} from ${EDUCATION.institution} (${EDUCATION.period}).`,
    followUps: ['What experience do you have?', 'Which languages do you speak?'],
  },
  {
    id: 'languages',
    keywords: ['language you speak', 'speak', 'english', 'urdu', 'spoken'],
    answer: () => LANGUAGES.map((l) => `• ${l.name} — ${l.level}`).join('\n'),
    followUps: ['Where are you located?', 'How can I contact you?'],
  },
  {
    id: 'location',
    keywords: ['location', 'where', 'based', 'city', 'country', 'islamabad', 'pakistan', 'remote', 'relocate'],
    answer: () =>
      `${PROFILE.name} is based in ${PROFILE.location}, and is open to remote work as well as on-site roles.`,
    followUps: ['Are you available for hire?', 'How can I contact you?'],
  },
  {
    id: 'hire',
    keywords: ['hire', 'available', 'availability', 'job offer', 'opportunity', 'freelance', 'open to', 'recruit'],
    answer: () =>
      `Yes — he's open to Frontend and Angular roles right now.\n\nThe quickest way is the "Hire me" button at the top, which drafts an email for you. Or reach him directly at ${PROFILE.email}.`,
    followUps: ['How can I contact you?', 'What experience do you have?'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'phone', 'call', 'linkedin', 'github', 'talk', 'connect'],
    answer: () =>
      `Here's how to reach ${PROFILE.name}:\n\n• Email: ${PROFILE.email}\n• Phone: ${PROFILE.phone}\n• LinkedIn: ${PROFILE.linkedin}\n\nHe replies to everything.`,
    followUps: ['Are you available for hire?', 'Where are you located?'],
  },
  {
    id: 'about',
    keywords: ['who', 'about', 'yourself', 'introduce', 'summary', 'tell me'],
    answer: () => PROFILE.summary,
    followUps: ['What experience do you have?', 'Which technologies do you know?'],
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'cheers', 'appreciate', 'bye', 'goodbye'],
    answer: () => `Happy to help. If you'd like to start a conversation, the "Hire me" button drafts an email for you.`,
    followUps: ['Are you available for hire?'],
  },
];

/** Shown when nothing matches — always offers a way forward. */
export const FALLBACK = `I'm a small static assistant, so I only know what's on this CV. Try asking about experience, skills, projects, performance, education, location, availability or contact details.`;
