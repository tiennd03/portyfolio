import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';
import { SKILLS } from '../core/site-config';
import { RevealDirective } from '../shared/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t().about;
    <section id="about" class="section">
      <div class="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div appReveal>
          <h2 class="section-title">{{ t.title }}</h2>
          @for (p of t.paragraphs; track $index) {
            <p class="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{{ p }}</p>
          }
        </div>

        <div appReveal>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-500">{{ t.skillsTitle }}</h3>
          <dl class="mt-4 space-y-5">
            @for (group of groups; track group.key) {
              <div>
                <dt class="mb-2 text-sm font-medium">{{ t.skillGroups[group.key] }}</dt>
                <dd class="flex flex-wrap gap-2">
                  @for (skill of group.items; track skill) {
                    <span class="tag">{{ skill }}</span>
                  }
                </dd>
              </div>
            }
          </dl>
        </div>
      </div>
    </section>
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly groups = (['core', 'ui', 'data', 'tools'] as const).map((key) => ({ key, items: SKILLS[key] }));
}
