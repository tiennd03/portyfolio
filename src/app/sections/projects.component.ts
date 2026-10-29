import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { PROJECT_LINKS } from '../core/site-config';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-projects',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t().projects;
    <section id="projects" class="section bg-white dark:bg-slate-900/40">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 class="section-title" appReveal>{{ t.title }}</h2>
        <p class="mt-2 text-slate-500 dark:text-slate-400" appReveal>{{ t.subtitle }}</p>

        <div class="mt-10 grid gap-6 md:grid-cols-2">
          @for (project of projects; track project.id) {
            @let item = t.items[project.id];
            <article appReveal class="card flex flex-col">
              <h3 class="text-xl font-semibold">{{ item.name }}</h3>
              <p class="mt-2 text-slate-600 dark:text-slate-300">{{ item.summary }}</p>

              <ul class="mt-4 space-y-1.5 text-sm">
                @for (h of item.highlights; track h) {
                  <li class="flex gap-2"><span class="text-indigo-600" aria-hidden="true">✓</span>{{ h }}</li>
                }
              </ul>

              <div class="mt-5 flex flex-wrap gap-2">
                @for (tag of project.tags; track tag) {
                  <span class="tag">{{ tag }}</span>
                }
              </div>

              <div class="mt-auto flex gap-3 pt-6 text-sm font-medium">
                @if (project.demo) {
                  <a [href]="project.demo" target="_blank" rel="noopener" class="btn-primary py-2">{{ t.demo }} ↗</a>
                }
                <a [href]="project.repo" target="_blank" rel="noopener" class="btn-secondary py-2">{{ t.code }}</a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ProjectsComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly projects = PROJECT_LINKS;
}
