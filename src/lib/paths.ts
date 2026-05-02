export function withBase(path: string, base = import.meta.env.BASE_URL): string {
	const normalizedBase = base.endsWith('/') ? base : `${base}/`;
	const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

	return new URL(normalizedPath, `https://example.com${normalizedBase}`).pathname;
}
