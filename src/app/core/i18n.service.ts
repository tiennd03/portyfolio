import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CONTENT, Content, Lang } from './content';

export const LANG_STORAGE_KEY = 'portfolio.lang';

/**
 * Current language + all texts for it. Components read `i18n.t()` — a computed signal —
 * so switching language re-renders every section with no page reload.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  // Always starts as English: that's what the prerendered HTML contains. Starting with a saved
  // 'vi' would make the first client render differ from the server HTML (a hydration mismatch).
  readonly lang = signal<Lang>('en');
  readonly t = computed<Content>(() => CONTENT[this.lang()]);

  constructor() {
    effect(() => {
      const content = this.t();
      this.document.documentElement.lang = this.lang();
      this.title.setTitle(content.meta.title);
      this.meta.updateTag({ name: 'description', content: content.meta.description });
      this.meta.updateTag({ property: 'og:title', content: content.meta.title });
      this.meta.updateTag({ property: 'og:description', content: content.meta.description });
    });
  }

  /** Called once in the browser after the first render: apply the saved or browser language. */
  restore(): void {
    if (!this.isBrowser) return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      // storage blocked
    }
    const preferred = saved ?? (navigator.language.toLowerCase().startsWith('vi') ? 'vi' : 'en');
    if (preferred === 'vi' || preferred === 'en') this.lang.set(preferred);
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }

  toggle(): void {
    this.set(this.lang() === 'en' ? 'vi' : 'en');
  }
}
