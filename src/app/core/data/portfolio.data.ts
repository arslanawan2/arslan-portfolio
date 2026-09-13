import type {
  Achievement,
  Education,
  Language,
  Metric,
  NavItem,
  Profile,
  Role,
  SkillGroup,
} from '../models/portfolio.model';

/** All content lives here — the components stay presentational,
 *  so updating the CV never means touching a template. */

export const PROFILE: Profile = {
  name: 'Arslan Awan',
  roles: ['Frontend Engineer', 'Angular Developer', 'Software Engineer'],
  location: 'Islamabad, Pakistan',
  email: 'marslan7514@gmail.com',
  phone: '+92 303 3917514',
  linkedin: 'https://linkedin.com/in/arslan-awan-engineer',
  github: 'https://github.com/arslanawan2',
  summary:
    'Frontend Engineer with 3 years of professional experience building production Angular applications with TypeScript, RxJS and Signals. Delivered integration-dense platforms across healthcare, fintech and enterprise AI governance, including multi-portal telehealth systems, real-time analytics dashboards and HIPAA / SOC 2 / GDPR-aligned interfaces. Experienced in performance optimization and third-party API integration within Agile sprint teams.',
  resumeFile: 'Arslan_Awan_Frontend_Engineer.pdf',
};

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export const METRICS: readonly Metric[] = [
  { value: 3, suffix: '+', label: 'Years building production Angular' },
  { value: 500, suffix: '+', label: 'Daily active users served' },
  { value: 60, suffix: '+', label: 'Real-time interactive graphs shipped' },
  { value: 40, suffix: '%', prefix: '~', label: 'Faster page loads after migration' },
];

export const ROLES: readonly Role[] = [
  {
    company: 'Z-Axiss SMC Pvt. Ltd',
    title: 'Frontend Engineer',
    period: 'Aug 2023 – Present',
    current: true,
    highlights: [
      {
        text: 'Designed and delivered the end-to-end frontend for a multi-role telehealth system connecting patients, providers, pharmacies and labs across 4 distinct portals, serving 500+ daily active users on a shared component architecture.',
        emphasis: ['4 distinct portals', '500+ daily active users'],
      },
      {
        text: 'Migrated 5+ complex business reports (60+ real-time interactive graphs) from Looker Studio to a custom Angular solution using Chart.js and Apache ECharts, enabling dynamic drill-down views and cutting average page load time by ~40%.',
        emphasis: ['60+ real-time interactive graphs', '~40%'],
      },
      {
        text: 'Improved production application performance by 35%+ through lazy loading, route-level code splitting and Angular change detection optimization, reducing bounce rates on data-heavy pages.',
        emphasis: ['35%+'],
      },
      {
        text: 'Owned the frontend implementation of a Generative AI Governance Platform — policy control UI, enterprise rule configurators and compliance dashboards aligned to HIPAA, SOC 2 and GDPR — supporting 3 enterprise clients at launch.',
        emphasis: ['HIPAA, SOC 2 and GDPR', '3 enterprise clients'],
      },
      {
        text: 'Scaled an AI-driven business acquisition platform by integrating Stripe for global subscription management and Firebase for real-time cloud push notifications, enabling operations across 10+ countries.',
        emphasis: ['Stripe', 'Firebase', '10+ countries'],
      },
      {
        text: 'Engineered complex multi-step plan management and user administration workflows for legal and telemarketing professionals, reducing form completion errors through standardised reusable reactive form components.',
        emphasis: ['reusable reactive form components'],
      },
      {
        text: 'Collaborated in 2-week Agile sprints, maintaining code quality standards through peer review and documentation.',
        emphasis: ['2-week Agile sprints'],
      },
    ],
  },
];

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    title: 'Frameworks & Libraries',
    icon: 'layers',
    skills: [
      'Angular',
      'RxJS',
      'Signals',
      'Standalone Components',
      'Angular Material',
      'Bootstrap',
      'Apache ECharts',
      'Chart.js',
    ],
  },
  {
    title: 'Programming Languages',
    icon: 'code',
    skills: ['TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'SCSS/SASS'],
  },
  {
    title: 'Integrations & Services',
    icon: 'plug',
    skills: ['TalkJS', 'Twilio', 'Stripe', 'Firebase', '1Merchant', 'DoseSpot', 'REST APIs', 'WebSockets'],
  },
  {
    title: 'Architecture & Performance',
    icon: 'gauge',
    skills: [
      'Micro-module Structure',
      'Lazy Loading',
      'Code Splitting',
      'Change Detection Optimization',
      'Responsive Design',
      'Accessibility (WCAG)',
    ],
  },
  {
    title: 'State Management',
    icon: 'flow',
    skills: ['Reactive Forms', 'Signal-based State', 'RxJS Observables'],
  },
  {
    title: 'Tools & Workflow',
    icon: 'tool',
    skills: ['Git', 'GitHub', 'Agile/Scrum', 'REST API Integration', 'Postman', 'npm', 'VS Code', 'Jira', 'Figma'],
  },
];

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    title: 'Integrated 6 enterprise-grade third-party services',
    detail:
      'Spearheaded Stripe, Firebase, Twilio, TalkJS, DoseSpot and 1Merchant across multiple production platforms — reducing manual operational workflows by 30%+ and enabling revenue-critical features including global subscription billing, HIPAA-compliant clinical communication and real-time e-prescribing.',
    icon: 'plug',
  },
  {
    title: 'Led adoption of Angular Signals & Standalone Components',
    detail:
      'Drove the migration across active projects, reducing boilerplate code by approximately 25% and simplifying state handling in shared modules.',
    icon: 'spark',
  },
];

/** Marquee strip under the hero. */
export const MARQUEE_ITEMS: readonly string[] = [
  'Angular',
  'TypeScript',
  'RxJS',
  'Signals',
  'Standalone Components',
  'Apache ECharts',
  'Chart.js',
  'Stripe',
  'Firebase',
  'Twilio',
  'TalkJS',
  'WebSockets',
  'SCSS',
  'WCAG',
];

export const EDUCATION: Education = {
  institution: 'PMAS Arid Agriculture University, Rawalpindi',
  degree: 'Bachelor of Science in Computer Science',
  period: '2019 – 2023',
};

export const LANGUAGES: readonly Language[] = [
  { name: 'English', level: 'Professional' },
  { name: 'Urdu', level: 'Native' },
];
