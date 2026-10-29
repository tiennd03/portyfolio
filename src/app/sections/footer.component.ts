import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { SITE } from '../core/site-config';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <div class="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 sm:flex-row sm:px-6">
        <p>© {{ year }} {{ name }}. {{ i18n.t().footer.rights }}</p>
        <p>{{ i18n.t().footer.builtWith }}</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly name = SITE.name;
  protected readonly year = new Date().getFullYear();
}
