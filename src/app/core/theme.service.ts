import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

const STORAGE_KEY = 'portfolio.theme';

/**
 * Dark mode. The `dark` class is put on <html> by a small script in index.html before Angular loads
 * (no white flash). This service only syncs with it after the first render and handles the toggle.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** false during prerender and the first client render, so both produce the same HTML. */
  readonly dark = signal(false);

  restore(): void {
    if (this.isBrowser) this.dark.set(this.root.classList.contains('dark'));
  }

  toggle(): void {
    const dark = !this.dark();
    this.dark.set(dark);
    this.root.classList.toggle('dark', dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }
}
