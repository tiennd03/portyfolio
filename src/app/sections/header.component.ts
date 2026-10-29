import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { ThemeService } from '../core/theme.service';
import { SITE } from '../core/site-config';

const SECTION_IDS = ['about', 'projects', 'services', 'faq', 'contact'] as const;
type SectionId = (typeof SECTION_IDS)[number];

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t();
    <header
      class="fixed inset-x-0 top-0 z-40 border-b transition-colors"
      [class]="scrolled() || menuOpen()
        ? 'border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85'
        : 'border-transparent'"
    >
      <nav class="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6" aria-label="Main">
        <a href="#top" class="mr-auto text-lg font-bold tracking-tight" (click)="menuOpen.set(false)">
          {{ name }}<span class="text-indigo-600">.</span>
        </a>

        <ul class="hidden items-center gap-1 text-sm font-medium md:flex">
          @for (link of links(); track link.id) {
            <li>
              <a
                [href]="'#' + link.id"
                class="rounded-lg px-3 py-2 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                [class.nav-active]="active() === link.id"
                [attr.aria-current]="active() === link.id ? 'location' : null"
              >
                {{ link.label }}
              </a>
            </li>
          }
        </ul>

        <button
          type="button"
          class="rounded-lg px-2.5 py-1.5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          (click)="i18n.toggle()"
          [attr.aria-label]="i18n.lang() === 'en' ? 'Chuyển sang tiếng Việt' : 'Switch to English'"
        >
          {{ i18n.lang() === 'en' ? 'VI' : 'EN' }}
        </button>
        <button
          type="button"
          class="grid size-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          (click)="theme.toggle()"
          [attr.aria-label]="theme.dark() ? 'Light mode' : 'Dark mode'"
        >
          {{ theme.dark() ? '☀️' : '🌙' }}
        </button>
        <button
          type="button"
          class="grid size-9 place-items-center rounded-lg hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
          (click)="menuOpen.set(!menuOpen())"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="mobile-menu"
          [attr.aria-label]="t.nav.menu"
        >
          {{ menuOpen() ? '✕' : '☰' }}
        </button>
      </nav>

      @if (menuOpen()) {
        <ul id="mobile-menu" class="space-y-1 border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          @for (link of links(); track link.id) {
            <li>
              <a [href]="'#' + link.id" class="block rounded-lg px-3 py-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-800" (click)="menuOpen.set(false)">
                {{ link.label }}
              </a>
            </li>
          }
        </ul>
      }
    </header>
  `,
})
export class HeaderComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);
  protected readonly name = SITE.name;

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly active = signal<SectionId | null>(null);

  protected readonly links = computed(() => {
    const nav = this.i18n.t().nav;
    return SECTION_IDS.map((id) => ({ id, label: nav[id] }));
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Browser-only work (scroll position, IntersectionObserver) goes in afterNextRender — it never runs on the server
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      // Scrollspy: a section counts as "current" when it crosses a line 40% down the screen
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.active.set(entry.target.id as SectionId);
          }
        },
        { rootMargin: '-40% 0px -55% 0px' },
      );
      for (const id of SECTION_IDS) {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      }

      destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        observer.disconnect();
      });
    });
  }
}
