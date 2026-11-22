import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Experience from './Experience.astro';
import type { ExperienceEntry } from '../../utils/cv.types';
import { longEntry, placement, saturdayJob, society } from '../../utils/cv.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (entries: ExperienceEntry[], props: { heading?: string; id?: string } = {}) =>
	container.renderToString(Experience, { props: { entries, ...props } });

describe('Experience', () => {
	describe('given entries', () => {
		it('shows an Experience heading and each entry as a list item, in order', async () => {
			const html = await render([placement, society]);
			expect(html).toMatch(/<h2[^>]*>\s*Experience\s*<\/h2>/);
			expect(html.match(/<li\b/g)).toHaveLength(2);
			expect(html.indexOf(placement.role)).toBeLessThan(html.indexOf(society.role));
		});

		it('shows the role as a heading, with the organisation, period, location and description', async () => {
			const html = await render([placement]);
			expect(html).toMatch(/<h3[^>]*>[\s\S]*Placement engineer[\s\S]*<\/h3>/);
			for (const text of [
				placement.organisation,
				placement.period,
				placement.location,
				placement.description,
			]) {
				expect(html).toContain(text);
			}
		});

		it('names the section by its heading', async () => {
			const html = await render([placement, society]);
			const id = html.match(/<h2[^>]*id="([^"]+)"/)?.[1];
			expect(id).toBeTruthy();
			expect(html).toContain(`aria-labelledby="${id}"`);
		});
	});

	describe('given an entry that has its own page', () => {
		it('links the role to that page', async () => {
			expect(await render([placement])).toMatch(
				/<h3[^>]*>\s*<a[^>]*href="\/experience\/placement-engineer-ford"[^>]*>\s*Placement engineer\s*<\/a>\s*<\/h3>/,
			);
		});
	});

	describe('given an entry without a page', () => {
		it('shows the role as plain text with no link', async () => {
			expect(await render([society])).not.toContain('<a');
		});
	});

	describe('given a different heading', () => {
		it('uses it for the section heading and its anchor, so the section can be reused', async () => {
			const html = await render([saturdayJob], { heading: 'Previous jobs', id: 'previous-jobs' });
			expect(html).toMatch(/<h2[^>]*>\s*Previous jobs\s*<\/h2>/);
			expect(html).toContain('id="previous-jobs"');
			expect(html).not.toMatch(/<h2[^>]*>\s*Experience\s*<\/h2>/);
		});
	});

	describe('given an entry with only the required fields', () => {
		it('shows it without a location or description', async () => {
			const html = await render([society]);
			expect(html).toContain(society.role);
			expect(html).not.toContain('undefined');
			expect(html).not.toContain('<p class="description');
		});
	});

	describe('given a very long entry', () => {
		it('shows all of it', async () => {
			const html = await render([longEntry]);
			for (const text of [longEntry.role, longEntry.organisation, longEntry.description]) {
				expect(html).toContain(text);
			}
		});
	});

	describe('given no entries', () => {
		it('shows nothing', async () => {
			expect((await render([])).trim()).toBe('');
		});
	});
});
