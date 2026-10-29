import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../core/contact.service';
import { I18nService } from '../core/i18n.service';
import { SITE } from '../core/site-config';
import { RevealDirective } from '../shared/reveal.directive';

type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RevealDirective],
  // Default change detection: form validity changes after typing/blur must refresh the error messages
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  protected readonly i18n = inject(I18nService);
  private readonly contact = inject(ContactService);
  protected readonly site = SITE;

  protected readonly status = signal<Status>('idle');

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    type: [''],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
    // Honeypot: hidden from people, but spam bots fill in every field. Filled = silently ignore.
    website: [''],
  });

  /** First error of a control, as a message in the current language — or null. */
  protected errorFor(control: AbstractControl): string | null {
    if (!control.touched || !control.errors) return null;
    const messages = this.i18n.t().contact.errors;
    if (control.hasError('required')) return messages.required;
    if (control.hasError('email')) return messages.email;
    if (control.hasError('minlength')) return messages.minlength;
    return null;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { website, ...msg } = this.form.getRawValue();
    if (website) {
      this.status.set('sent'); // pretend it worked so bots don't retry
      return;
    }

    this.status.set('sending');
    this.contact.send({ ...msg, type: msg.type || this.i18n.t().contact.budgetOptions[0] }).subscribe({
      next: (result) => {
        this.status.set(result);
        if (result === 'sent') this.form.reset();
      },
      error: () => this.status.set('error'),
    });
  }

  protected reset(): void {
    this.form.reset();
    this.status.set('idle');
  }
}
