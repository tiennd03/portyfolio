import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-faq',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t().faq;
    <section id="faq" class="section bg-white dark:bg-slate-900/40">
      <div class="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 class="section-title" appReveal>{{ t.title }}</h2>
        <!-- Native <details>: accessible and keyboard-friendly accordion with zero JavaScript -->
        <div class="mt-8 divide-y divide-slate-200 dark:divide-slate-800" appReveal>
          @for (item of t.items; track $index) {
            <details class="group py-4">
              <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {{ item.q }}
                <span class="text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
              </summary>
              <p class="mt-3 text-slate-600 dark:text-slate-300">{{ item.a }}</p>
            </details>
          }
        </div>
      </div>
    </section>
  `,
})
export class FaqComponent {
  protected readonly i18n = inject(I18nService);
}
