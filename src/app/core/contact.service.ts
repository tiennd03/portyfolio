import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { SITE } from './site-config';

export interface ContactMessage {
  name: string;
  email: string;
  type: string;
  message: string;
}

/** 'sent' = delivered by Formspree; 'mailto' = handed to the visitor's email app. */
export type SendResult = 'sent' | 'mailto';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  send(msg: ContactMessage): Observable<SendResult> {
    if (SITE.formspreeId) {
      return this.http
        .post(`https://formspree.io/f/${SITE.formspreeId}`, msg, { headers: { Accept: 'application/json' } })
        .pipe(map(() => 'sent' as const));
    }

    // No backend configured: open the visitor's email app with everything filled in
    window.location.href = buildMailto(msg);
    return of('mailto' as const);
  }
}

export function buildMailto(msg: ContactMessage, to = SITE.email): string {
  const subject = `[${msg.type}] Project enquiry from ${msg.name}`;
  const body = `${msg.message}\n\n— ${msg.name} (${msg.email})`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
