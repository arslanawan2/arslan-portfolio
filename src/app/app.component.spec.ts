import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PROFILE } from './core/data/portfolio.data';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents();
  });

  it('creates the shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the name in the hero', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain(PROFILE.name);
  });

  it('exposes every nav anchor so in-page links resolve', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    for (const id of ['home', 'about', 'experience', 'skills', 'achievements', 'contact']) {
      expect(host.querySelector(`#${id}`)).withContext(`missing anchor #${id}`).toBeTruthy();
    }
  });
});
