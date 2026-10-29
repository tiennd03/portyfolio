import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/i18n.service';
import { ThemeService } from './core/theme.service';
import { FooterComponent } from './sections/footer.component';
import { HeaderComponent } from './sections/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a href="#about" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
      Skip to content
    </a>
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class App {
  constructor() {
    const i18n = inject(I18nService);
    const theme = inject(ThemeService);

    // The first render must match the prerendered HTML exactly (English, light icons).
    // Only after it, apply the visitor's saved preferences — this runs in the browser only.
    afterNextRender(() => {
      i18n.restore();
      theme.restore();
    });
  }
}
