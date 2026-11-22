import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ExperienceDetail from './ExperienceDetail.astro';
import type { Experience } from '../../utils/experience.types';
import { fullExperience, longTitleExperience, minimalExperience } from './experienceDetail.fixture';

let container: AstroContainer;
beforeAll(async () => {
	container = await AstroContainer.create();
});

const render = (experience: Experience) =>
	container.renderToString(ExperienceDetail, { props: { experience } });

const headings = (html: string, level: number) =>
	[...html.matchAll(new RegExp(`<h${level}[^>]*>([^<]*)</h${level}>`, 'g'))].map((m) => m[1]);

describe('Experience detail', () => {
	describe('given an experience with blocks', () => {
		it('shows the role as the single page heading', async () => {
			expect(headings(await render(fullExperience), 1)).toEqual(['Placement engineer']);
		});

		it('shows the organisation, dates and location', async () => {
			const html = await render(fullExperience);
			for (const text of ['Ford, Dunton', 'Jun – Sep 2024', 'Essex']) {
				expect(html).toContain(text);
			}
		});

		it('shows the blocks in order below the page heading', async () => {
			const html = await render(fullExperience);
			expect(headings(html, 2)).toEqual(['The team', 'Results']);
			expect(headings(html, 3)).toEqual(['Test rig']);
			expect(html.indexOf('The team')).toBeLessThan(html.indexOf('Test rig'));
			expect(html.indexOf('Test rig')).toBeLessThan(html.indexOf('Results'));
		});

		it('links back to the experience list', async () => {
			expect(await render(fullExperience)).toMatch(
				/<a[^>]*href="\/#experience"[^>]*>All experience<\/a>/,
			);
		});
	});

	describe('given an experience with no location and no blocks yet', () => {
		it('shows the details without an empty location or content area', async () => {
			const html = await render(minimalExperience);
			expect(headings(html, 1)).toEqual(['Placement engineer']);
			expect(html).not.toContain('Location');
			expect(html).not.toContain('undefined');
			expect(html).not.toContain('class="blocks');
		});
	});

	describe('given a very long role', () => {
		it('still shows the whole role in a single heading', async () => {
			expect(headings(await render(longTitleExperience), 1)).toEqual([longTitleExperience.role]);
		});
	});
});
