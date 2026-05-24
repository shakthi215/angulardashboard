import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'nexusdash-theme';
  private readonly themeSubject = new BehaviorSubject<AppTheme>(this.getInitialTheme());

  theme$ = this.themeSubject.asObservable();

  get currentTheme(): AppTheme {
    return this.themeSubject.value;
  }

  init(): void {
    this.applyTheme(this.currentTheme);
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: AppTheme): void {
    localStorage.setItem(this.storageKey, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  private getInitialTheme(): AppTheme {
    const saved = localStorage.getItem(this.storageKey);
    return saved === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: AppTheme): void {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    document.body.setAttribute('data-theme', theme);
  }
}
