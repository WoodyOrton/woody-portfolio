import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Header from './Header.astro';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

describe('Header', () => {
	describe('given a name', () => {
		it('labels the home link with the name and its first letter', async () => {
			const html = await container.renderToString(Header, { props: { name: 'Woody' } });
			expect(html).toContain('aria-label="Woody, home"');
			expect(html).toMatch(/>\s*W\s*<\/a>/);
		});
	});

	describe('given a different name', () => {
		it('follows the name', async () => {
			const html = await container.renderToString(Header, { props: { name: 'Alex' } });
			expect(html).toContain('aria-label="Alex, home"');
			expect(html).toMatch(/>\s*A\s*<\/a>/);
		});
	});

	describe('given the main navigation', () => {
		it('links to the projects page, labelled Projects', async () => {
			const html = await container.renderToString(Header, { props: { name: 'Woody Orton' } });
			expect(html).toMatch(/<a[^>]*href="\/projects"[^>]*>\s*Projects\s*<\/a>/);
			expect(html).not.toMatch(/>\s*Work\s*</);
		});
	});

	describe('given the main navigation links', () => {
		it('links to the experience section, between About and Contact', async () => {
			const html = await container.renderToString(Header, { props: { name: 'Woody Orton' } });
			expect(html).toMatch(/<a[^>]*href="\/#experience"[^>]*>\s*Experience\s*<\/a>/);
			const order = ['About', 'Experience', 'Contact'].map((label) =>
				html.search(new RegExp(`>\\s*${label}\\s*<`)),
			);
			expect(order).toEqual([...order].sort((a, b) => a - b));
			expect(order.every((i) => i > -1)).toBe(true);
		});
	});
});
