import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Hobbies from './Hobbies.astro';
import type { HobbyEntry } from '../../utils/cv.types';
import { climbing, full, karting } from '../../utils/cv.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (entries: HobbyEntry[]) => container.renderToString(Hobbies, { props: { entries } });

describe('Hobbies', () => {
	describe('given hobbies', () => {
		it('shows a Hobbies heading and each hobby as a list item, in order', async () => {
			const html = await render(full.hobbies);
			expect(html).toMatch(/<h2[^>]*>\s*Hobbies\s*<\/h2>/);
			expect(html.match(/<li\b/g)).toHaveLength(2);
			expect(html.indexOf(karting.name)).toBeLessThan(html.indexOf(climbing.name));
		});

		it('shows the name as a heading, with the period and description', async () => {
			const html = await render([karting]);
			expect(html).toMatch(/<h3[^>]*>\s*Karting\s*<\/h3>/);
			expect(html).toContain(karting.period);
			expect(html).toContain(karting.description);
		});

		it('names the section by its heading', async () => {
			const html = await render(full.hobbies);
			const id = html.match(/<h2[^>]*id="([^"]+)"/)?.[1];
			expect(id).toBeTruthy();
			expect(html).toContain(`aria-labelledby="${id}"`);
		});
	});

	describe('given a hobby with only a name', () => {
		it('shows just the name, with no empty period or description', async () => {
			const html = await render([climbing]);
			expect(html).toContain('Climbing');
			expect(html).not.toContain('undefined');
			expect(html).not.toContain('<p class="description');
			expect(html).not.toContain('<p class="period');
		});
	});

	describe('given no hobbies', () => {
		it('shows nothing', async () => {
			expect((await render([])).trim()).toBe('');
		});
	});
});
