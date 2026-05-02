import { describe, expect, test } from 'vitest';
import {
	digestExcerpt,
	formatDigestDate,
	formatDigestMonth,
	getArchiveMonths,
	parseDigestDate,
	splitDigestMarkdown,
} from '../src/lib/digests';

describe('digest utilities', () => {
	test('parses route dates from YYYY-MM-DD content ids', () => {
		expect(parseDigestDate('2026-05-02')).toBe('2026-05-02');
		expect(parseDigestDate('2026-05-02.md')).toBe('2026-05-02');
	});

	test('rejects digest ids that do not match the filename contract', () => {
		expect(() => parseDigestDate('may-2')).toThrow('Digest filename must be YYYY-MM-DD.md');
	});

	test('extracts the first non-empty line as title and removes it from body', () => {
		const digest = splitDigestMarkdown(`

📅 Daily Digest — May 2, 2026

**Software Engineering & Architecture**  
Important development. [Source](https://example.com)
`);

		expect(digest.title).toBe('📅 Daily Digest — May 2, 2026');
		expect(digest.body).toBe(
			'**Software Engineering & Architecture**  \nImportant development. [Source](https://example.com)',
		);
	});

	test('formats digest dates and archive months in UTC', () => {
		expect(formatDigestDate('2026-05-02')).toBe('May 2, 2026');
		expect(formatDigestMonth('2026-05')).toBe('May 2026');
	});

	test('creates readable excerpts from markdown bodies', () => {
		expect(
			digestExcerpt(
				'**Software Engineering**  \nA useful update with [a source](https://example.com).',
			),
		).toBe('Software Engineering A useful update with a source.');
	});

	test('returns archive months once in newest-first order', () => {
		const months = getArchiveMonths([
			{ month: '2026-05', monthLabel: 'May 2026' },
			{ month: '2026-05', monthLabel: 'May 2026' },
			{ month: '2026-04', monthLabel: 'April 2026' },
		]);

		expect(months).toEqual([
			{ value: '2026-05', label: 'May 2026' },
			{ value: '2026-04', label: 'April 2026' },
		]);
	});
});
