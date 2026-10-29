import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Fades an element in when it first scrolls into view.
 *
 * - The hidden state is added only in the browser (afterNextRender never runs during prerender),
 *   so the prerendered HTML — what search engines and no-JS visitors get — is fully visible.
 * - Users who ask their OS for reduced motion get no animation.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      el.classList.add('reveal');
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            el.classList.add('reveal-visible');
            observer.disconnect(); // animate once
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
