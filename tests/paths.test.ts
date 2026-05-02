import { describe, expect, test } from 'vitest';
import { withBase } from '../src/lib/paths';

describe('path helpers', () => {
	test('prefixes internal links with the configured Astro base path', () => {
		expect(withBase('/digests/2026-05-02/', '/news-digest/')).toBe(
			'/news-digest/digests/2026-05-02/',
		);
	});

	test('keeps root links inside the configured base path', () => {
		expect(withBase('/', '/news-digest/')).toBe('/news-digest/');
	});
});
