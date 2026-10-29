import { buildMailto } from './contact.service';

describe('buildMailto', () => {
  it('fills in subject and body, encoded for a URL', () => {
    const url = buildMailto(
      { name: 'Anna Lee', email: 'anna@example.com', type: 'Bug fixing', message: 'Hi & hello' },
      'me@example.com',
    );
    expect(url.startsWith('mailto:me@example.com?subject=')).toBeTrue();
    expect(decodeURIComponent(url)).toContain('[Bug fixing] Project enquiry from Anna Lee');
    expect(decodeURIComponent(url)).toContain('Hi & hello');
    expect(url).not.toContain(' '); // spaces must be encoded
  });
});
