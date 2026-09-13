/** Shape of the portfolio's content layer. Keeping this typed
 *  means the templates can never drift from the data. */

export interface Profile {
  readonly name: string;
  readonly roles: readonly string[];
  readonly location: string;
  readonly email: string;
  readonly phone: string;
  readonly linkedin: string;
  readonly github: string;
  readonly summary: string;
  readonly resumeFile: string;
}

export interface Metric {
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
  /** Rendered before the number, e.g. "~". */
  readonly prefix?: string;
}

export interface Role {
  readonly company: string;
  readonly title: string;
  readonly period: string;
  readonly current: boolean;
  readonly highlights: readonly Highlight[];
}

export interface Highlight {
  readonly text: string;
  /** Substrings emphasised in the rendered bullet. */
  readonly emphasis: readonly string[];
}

export interface SkillGroup {
  readonly title: string;
  readonly icon: string;
  readonly skills: readonly string[];
}

export interface Achievement {
  readonly title: string;
  readonly detail: string;
  readonly icon: string;
}

export interface Education {
  readonly institution: string;
  readonly degree: string;
  readonly period: string;
}

export interface Language {
  readonly name: string;
  readonly level: string;
}

export interface NavItem {
  readonly id: string;
  readonly label: string;
}
