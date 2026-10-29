import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutComponent } from './sections/about.component';
import { ContactComponent } from './sections/contact.component';
import { FaqComponent } from './sections/faq.component';
import { HeroComponent } from './sections/hero.component';
import { ProjectsComponent } from './sections/projects.component';
import { ServicesComponent } from './sections/services.component';

/** The whole landing page: one component per section, in reading order. */
@Component({
  selector: 'app-home',
  imports: [HeroComponent, AboutComponent, ProjectsComponent, ServicesComponent, FaqComponent, ContactComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-about />
    <app-projects />
    <app-services />
    <app-faq />
    <app-contact />
  `,
})
export class HomeComponent {}
