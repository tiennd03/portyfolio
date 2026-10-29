import { CONTENT } from './content';
import { PROJECT_LINKS } from './site-config';

// TypeScript already guarantees both languages have every field.
// These tests catch what types can't: lists of different lengths (a forgotten FAQ translation, etc.).
describe('content', () => {
  const { en, vi } = CONTENT;

  it('has the same number of list items in both languages', () => {
    expect(vi.about.paragraphs.length).toBe(en.about.paragraphs.length);
    expect(vi.services.items.length).toBe(en.services.items.length);
    expect(vi.services.process.length).toBe(en.services.process.length);
    expect(vi.faq.items.length).toBe(en.faq.items.length);
    expect(vi.contact.budgetOptions.length).toBe(en.contact.budgetOptions.length);
  });

  it('has text for every project in both languages', () => {
    for (const project of PROJECT_LINKS) {
      expect(en.projects.items[project.id].name).toBeTruthy();
      expect(vi.projects.items[project.id].name).toBeTruthy();
      expect(vi.projects.items[project.id].highlights.length).toBe(en.projects.items[project.id].highlights.length);
    }
  });

  it('keeps the meta description within the length search engines show', () => {
    expect(en.meta.description.length).toBeLessThanOrEqual(160);
    expect(vi.meta.description.length).toBeLessThanOrEqual(170);
  });
});
