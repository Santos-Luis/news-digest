import type { CollectionEntry } from 'astro:content';
import { marked } from 'marked';

export type DigestEntry = CollectionEntry<'digests'>;

export type DigestSummary = {
	entry: DigestEntry;
	date: string;
	title: string;
	body: string;
	bodyHtml: string;
	excerpt: string;
	month: string;
	monthLabel: string;
	href: string;
};

export type ArchiveMonth = {
	month: string;
	monthLabel: string;
};

const DATE_ID_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDigestDate(id: string): string {
	const date = id.replace(/\.md$/, '');

	if (!DATE_ID_PATTERN.test(date)) {
		throw new Error(`Digest filename must be YYYY-MM-DD.md, received: ${id}`);
	}

	return date;
}

export function formatDigestDate(date: string): string {
	const parsed = new Date(`${date}T00:00:00Z`);

	return new Intl.DateTimeFormat('en', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(parsed);
}

export function getDigestMonth(date: string): string {
	return date.slice(0, 7);
}

export function formatDigestMonth(month: string): string {
	const parsed = new Date(`${month}-01T00:00:00Z`);

	return new Intl.DateTimeFormat('en', {
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(parsed);
}

export function splitDigestMarkdown(markdown: string, fallbackTitle = 'Daily Digest') {
	const normalized = markdown.replace(/^\uFEFF/, '').trim();
	const lines = normalized.split(/\r?\n/);
	const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);

	if (firstContentIndex === -1) {
		return {
			title: fallbackTitle,
			body: '',
		};
	}

	const title = lines[firstContentIndex].trim().replace(/^#+\s*/, '') || fallbackTitle;
	const body = lines
		.filter((_, index) => index !== firstContentIndex)
		.join('\n')
		.trim();

	return { title, body };
}

export function digestMarkdownToHtml(markdown: string): string {
	return marked.parse(markdown, {
		async: false,
		gfm: true,
	}) as string;
}

export function digestExcerpt(markdown: string, maxLength = 360): string {
	const plainText = markdown
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[*_`>#-]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	if (plainText.length <= maxLength) {
		return plainText;
	}

	return `${plainText.slice(0, maxLength).trim()}...`;
}

export function toDigestSummary(entry: DigestEntry): DigestSummary {
	const date = parseDigestDate(entry.id);
	const bodySource = entry.body ?? '';
	const parsed = splitDigestMarkdown(bodySource, entry.data.title ?? 'Daily Digest');
	const month = getDigestMonth(date);

	return {
		entry,
		date,
		title: entry.data.title ?? parsed.title,
		body: parsed.body,
		bodyHtml: digestMarkdownToHtml(parsed.body),
		excerpt: digestExcerpt(parsed.body),
		month,
		monthLabel: formatDigestMonth(month),
		href: `/digests/${date}/`,
	};
}

export function sortDigestsNewestFirst(entries: DigestEntry[]): DigestSummary[] {
	return entries.map(toDigestSummary).sort((left, right) => right.date.localeCompare(left.date));
}

export function getArchiveMonths<T extends ArchiveMonth>(digests: T[]) {
	const seen = new Set<string>();

	return digests
		.filter((digest) => {
			if (seen.has(digest.month)) {
				return false;
			}

			seen.add(digest.month);

			return true;
		})
		.map((digest) => ({
			value: digest.month,
			label: digest.monthLabel,
		}));
}
