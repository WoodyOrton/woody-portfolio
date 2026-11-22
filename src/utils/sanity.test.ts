import { describe, expect, it } from 'vitest';
import {
	EXPERIENCES_QUERY,
	EXPERIENCE_QUERY,
	PROJECTS_QUERY,
	PROJECT_QUERY,
	imageUrl,
	toExperience,
	toExperienceSummaries,
	toProject,
} from './sanity';
import { placement } from './cv.fixture';

const imageSource = {
	_type: 'image',
	asset: { _ref: 'image-abc123-1600x900-jpg', _type: 'reference' },
};

describe('Sanity image URLs', () => {
	describe('given an image source and a width and height', () => {
		const url = new URL(imageUrl(imageSource, { width: 800, height: 450 }));

		it('requests the image at the given width and height', () => {
			expect(url.searchParams.get('w')).toBe('800');
			expect(url.searchParams.get('h')).toBe('450');
		});

		it('serves the image from the Sanity CDN', () => {
			expect(url.hostname).toBe('cdn.sanity.io');
			expect(url.pathname).toContain('abc123-1600x900.jpg');
		});

		it('asks for an automatically chosen modern format', () => {
			expect(url.searchParams.get('auto')).toBe('format');
		});
	});

	describe('given only a width', () => {
		it('does not force a height', () => {
			const url = new URL(imageUrl(imageSource, { width: 800 }));
			expect(url.searchParams.get('w')).toBe('800');
			expect(url.searchParams.has('h')).toBe(false);
		});
	});
});

describe('Sanity queries', () => {
	describe('given the project query', () => {
		it('looks up a project by its slug', () => {
			expect(PROJECT_QUERY).toContain('_type == "project"');
			expect(PROJECT_QUERY).toContain('slug.current == $slug');
		});

		it('fetches the ordered blocks array with each block type and key', () => {
			expect(PROJECT_QUERY).toContain('blocks[]');
			expect(PROJECT_QUERY).toContain('_type');
			expect(PROJECT_QUERY).toContain('_key');
		});

		it('fetches the heading fields for heading blocks', () => {
			expect(PROJECT_QUERY).toContain('_type == "heading" => { text, level }');
		});

		it('fetches the body for rich text blocks', () => {
			expect(PROJECT_QUERY).toContain('_type == "richText" => { body }');
		});

		it('fetches the layout and each image with its alt, caption, focal point and size for image sets', () => {
			expect(PROJECT_QUERY).toContain('_type == "imageSet"');
			for (const field of ['layout', 'alt', 'caption', 'hotspot', 'crop', 'lqip', 'dimensions']) {
				expect(PROJECT_QUERY).toContain(field);
			}
		});

		it('fetches the details shown in the page title block', () => {
			for (const field of ['system', 'year', 'context']) {
				expect(PROJECT_QUERY).toContain(field);
			}
		});
	});

	describe('given the projects query', () => {
		it('fetches only published projects that have a slug', () => {
			expect(PROJECTS_QUERY).toContain('_type == "project"');
			expect(PROJECTS_QUERY).toContain('defined(slug.current)');
		});

		it('fetches only what the list and page paths need', () => {
			for (const field of ['title', '"slug": slug.current', 'system', 'year', 'context']) {
				expect(PROJECTS_QUERY).toContain(field);
			}
			expect(PROJECTS_QUERY).not.toContain('blocks');
		});

		it('fetches the cover image with its alt text, focal point and size', () => {
			expect(PROJECTS_QUERY).toContain('cover{');
			for (const field of ['alt', 'hotspot', 'crop', 'lqip', 'dimensions']) {
				expect(PROJECTS_QUERY).toContain(field);
			}
		});

		it('lists the newest projects first', () => {
			expect(PROJECTS_QUERY).toContain('order(year desc');
		});
	});
});

describe('Sanity project data', () => {
	const raw = {
		title: 'T',
		slug: 's',
		system: 'Brakes',
		year: '2025',
		context: 'C',
		blocks: null,
	};

	describe('given no project', () => {
		it('returns null', () => {
			expect(toProject(null)).toBeNull();
		});
	});

	describe('given a project whose blocks have never been set', () => {
		it('treats the blocks as an empty list', () => {
			expect(toProject(raw)?.blocks).toEqual([]);
		});
	});

	describe('given a project with blocks', () => {
		it('keeps them in order', () => {
			const blocks = [
				{ _type: 'heading' as const, _key: 'a', text: 'One' },
				{ _type: 'heading' as const, _key: 'b', text: 'Two' },
			];
			expect(toProject({ ...raw, blocks })?.blocks).toEqual(blocks);
		});
	});
});

describe('Experience queries', () => {
	describe('given the experience list query', () => {
		it('fetches only experience documents that have a slug', () => {
			expect(EXPERIENCES_QUERY).toContain('_type == "experience"');
			expect(EXPERIENCES_QUERY).toContain('defined(slug.current)');
		});

		it('fetches what the list shows and the page path needs, but not the blocks', () => {
			for (const field of [
				'role',
				'organisation',
				'period',
				'location',
				'description',
				'"slug": slug.current',
			]) {
				expect(EXPERIENCES_QUERY).toContain(field);
			}
			expect(EXPERIENCES_QUERY).not.toContain('blocks');
		});

		it('lists the most recently started first', () => {
			expect(EXPERIENCES_QUERY).toContain('order(startDate desc');
		});
	});

	describe('given the experience page query', () => {
		it('looks up one experience by its slug', () => {
			expect(EXPERIENCE_QUERY).toContain('_type == "experience"');
			expect(EXPERIENCE_QUERY).toContain('slug.current == $slug');
		});

		it('fetches the page details and the same blocks a project page has', () => {
			for (const field of ['role', 'organisation', 'period', 'location']) {
				expect(EXPERIENCE_QUERY).toContain(field);
			}
			expect(EXPERIENCE_QUERY).toContain('blocks[]');
			expect(EXPERIENCE_QUERY).toContain('_type == "heading" => { text, level }');
			expect(EXPERIENCE_QUERY).toContain('_type == "richText" => { body }');
			expect(EXPERIENCE_QUERY).toContain('_type == "imageSet"');
		});
	});
});

describe('Sanity experience data', () => {
	const raw = { ...placement, blocks: null };

	describe('given no experience', () => {
		it('returns null', () => {
			expect(toExperience(null)).toBeNull();
		});
	});

	describe('given an experience whose blocks have never been set', () => {
		it('treats the blocks as an empty list', () => {
			expect(toExperience(raw)?.blocks).toEqual([]);
		});
	});

	describe('given a list that includes entries missing a required field', () => {
		it('leaves those entries out', () => {
			expect(
				toExperienceSummaries([{ _key: 'a', role: 'Engineer', slug: 'e' }, placement]),
			).toEqual([placement]);
		});
	});

	describe('given a list with nothing set', () => {
		it('returns an empty list', () => {
			expect(toExperienceSummaries(null)).toEqual([]);
		});
	});
});
