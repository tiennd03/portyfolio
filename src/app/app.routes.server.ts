import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Prerender (SSG): at build time Angular runs the app once and saves the resulting HTML.
 * Visitors and search engines get a complete page instantly; Angular then "hydrates" it.
 */
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];
