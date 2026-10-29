import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-services',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t().services;
    <section id="services" class="section">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 class="section-title" appReveal>{{ t.title }}</h2>

        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          @for (s of t.items; track $index) {
            <div appReveal class="card">
              <span class="text-3xl" aria-hidden="true">{{ s.icon }}</span>
              <h3 class="mt-4 font-semibold">{{ s.name }}</h3>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ s.text }}</p>
            </div>
          }
        </div>

        <h3 class="mt-20 text-2xl font-semibold" appReveal>{{ t.processTitle }}</h3>
        <ol class="mt-8 grid gap-6 md:grid-cols-4">
          @for (step of t.process; track $index) {
            <li appReveal class="relative">
              <span class="grid size-10 place-items-center rounded-full bg-indigo-600 font-semibold text-white">{{ $index + 1 }}</span>
              @if (!$last) {
                <!-- Connector line to the next step (desktop only) -->
                <span class="absolute left-12 right-0 top-5 hidden h-px bg-slate-300 md:block dark:bg-slate-700" aria-hidden="true"></span>
              }
              <h4 class="mt-4 font-semibold">{{ step.name }}</h4>
              <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ step.text }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class ServicesComponent {
  protected readonly i18n = inject(I18nService);
}
