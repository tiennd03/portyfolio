import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContactService } from '../core/contact.service';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let el: HTMLElement;
  let send: jasmine.Spy;

  beforeEach(() => {
    send = jasmine.createSpy('send').and.returnValue(of('sent'));
    TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [{ provide: ContactService, useValue: { send } }],
    });
    fixture = TestBed.createComponent(ContactComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  function type(selector: string, value: string): void {
    const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function submit(): void {
    el.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('shows errors and does not send when the form is empty', () => {
    submit();
    expect(el.querySelectorAll('.field-error').length).toBe(3);
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects a message shorter than 20 characters', () => {
    type('[formControlName=name]', 'Anna');
    type('[formControlName=email]', 'anna@example.com');
    type('[formControlName=message]', 'Too short');
    submit();
    expect(el.textContent).toContain('at least 20 characters');
    expect(send).not.toHaveBeenCalled();
  });

  it('sends a valid message and shows the success state', () => {
    type('[formControlName=name]', 'Anna');
    type('[formControlName=email]', 'anna@example.com');
    type('[formControlName=message]', 'I need help upgrading an Angular 12 app.');
    submit();

    expect(send).toHaveBeenCalledOnceWith(jasmine.objectContaining({ name: 'Anna', email: 'anna@example.com' }));
    expect(el.textContent).toContain('message sent');
  });

  it('silently drops submissions that fill the honeypot', () => {
    type('[formControlName=name]', 'Bot');
    type('[formControlName=email]', 'bot@example.com');
    type('[formControlName=message]', 'Buy cheap followers now, best price!!!');
    type('[formControlName=website]', 'http://spam.example');
    submit();
    expect(send).not.toHaveBeenCalled();
  });
});
