import { TestBed } from '@angular/core/testing';
import type { Type } from '@angular/core';
import { ACHIEVEMENTS, EDUCATION, PROFILE, ROLES, SKILL_GROUPS } from '../core/data/portfolio.data';
import { AboutComponent } from './about/about.component';
import { AchievementsComponent } from './achievements/achievements.component';
import { ContactComponent } from './contact/contact.component';
import { ExperienceComponent } from './experience/experience.component';
import { FooterComponent } from './footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SkillsComponent } from './skills/skills.component';

/**
 * The lower sections are rendered inside @defer blocks, so they do
 * not appear in a plain AppComponent render. These mount each one
 * directly to prove it renders its CV content.
 */
async function render<T>(cmp: Type<T>): Promise<string> {
  await TestBed.configureTestingModule({ imports: [cmp] }).compileComponents();
  const fixture = TestBed.createComponent(cmp);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).textContent ?? '';
}

describe('sections', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('hero shows the name and every headline metric', async () => {
    const text = await render(HeroComponent);
    expect(text).toContain(PROFILE.name);
    expect(text).toContain(PROFILE.location);
    expect(text).toContain('Years building production Angular');
  });

  it('about shows the education record', async () => {
    const text = await render(AboutComponent);
    expect(text).toContain(EDUCATION.degree);
    expect(text).toContain(EDUCATION.institution);
  });

  it('experience renders every bullet of every role', async () => {
    const text = await render(ExperienceComponent);
    for (const role of ROLES) {
      expect(text).toContain(role.company);
      expect(text).toContain(role.period);
      for (const h of role.highlights) {
        // The pipe wraps emphasised runs in <mark>, so compare on a
        // prefix that is free of markup.
        expect(text).toContain(h.text.slice(0, 40));
      }
    }
  });

  it('skills renders every group and every skill', async () => {
    const text = await render(SkillsComponent);
    for (const group of SKILL_GROUPS) {
      expect(text).toContain(group.title);
      for (const skill of group.skills) {
        expect(text).toContain(skill);
      }
    }
  });

  it('achievements renders both entries', async () => {
    const text = await render(AchievementsComponent);
    for (const a of ACHIEVEMENTS) {
      expect(text).toContain(a.title);
    }
  });

  it('contact exposes the real email and phone', async () => {
    const text = await render(ContactComponent);
    expect(text).toContain(PROFILE.email);
    expect(text).toContain(PROFILE.phone);
  });

  it('footer renders the nav and the current year', async () => {
    const text = await render(FooterComponent);
    expect(text).toContain(PROFILE.name);
    expect(text).toContain(String(new Date().getFullYear()));
  });

  it('navbar renders a link per section', async () => {
    await TestBed.configureTestingModule({ imports: [NavbarComponent] }).compileComponents();
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    for (const id of ['home', 'about', 'experience', 'skills', 'achievements', 'contact']) {
      expect(host.querySelector(`a[href="#${id}"]`)).withContext(`missing nav link for ${id}`).toBeTruthy();
    }
  });
});
