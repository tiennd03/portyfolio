import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { I18nService, LANG_STORAGE_KEY } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    localStorage.removeItem(LANG_STORAGE_KEY);
    service = TestBed.inject(I18nService);
  });

  afterEach(() => localStorage.removeItem(LANG_STORAGE_KEY));

  it('starts in English so the first render matches the prerendered HTML', () => {
    expect(service.lang()).toBe('en');
    expect(service.t().nav.about).toBe('About');
  });

  it('switches texts, <html lang> and the page title', () => {
    service.set('vi');
    TestBed.tick(); // run the effect that updates the document

    expect(service.t().nav.about).toBe('Giới thiệu');
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('vi');
    expect(TestBed.inject(Title).getTitle()).toContain('Lập trình viên');
  });

  it('remembers the chosen language', () => {
    service.toggle();
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('vi');
  });

  it('restores a saved language', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'vi');
    service.restore();
    expect(service.lang()).toBe('vi');
  });

  it('ignores an unknown saved value', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'fr');
    service.restore();
    expect(service.lang()).toBe('en');
  });
});
