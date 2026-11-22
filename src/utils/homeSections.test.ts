import { describe, expect, it } from 'vitest';
import { DEFAULT_SECTION_ORDER, HOME_SECTIONS, resolveSectionOrder } from './homeSections';

describe('Home page section order', () => {
	describe('given no order has been chosen', () => {
		it('shows every section in the standard order', () => {
			expect(resolveSectionOrder(null)).toEqual(DEFAULT_SECTION_ORDER);
			expect(resolveSectionOrder([])).toEqual(DEFAULT_SECTION_ORDER);
		});

		it('starts with projects and ends with hobbies', () => {
			expect(DEFAULT_SECTION_ORDER[0]).toBe('projects');
			expect(DEFAULT_SECTION_ORDER.at(-1)).toBe('hobbies');
		});
	});

	describe('given a complete custom order', () => {
		it('shows the sections in that order', () => {
			const reversed = [...DEFAULT_SECTION_ORDER].reverse();
			expect(resolveSectionOrder(reversed)).toEqual(reversed);
		});
	});

	describe('given an order that leaves some sections out', () => {
		it('keeps the chosen sections first and adds the rest in the standard order', () => {
			expect(resolveSectionOrder(['skills', 'about'])).toEqual([
				'skills',
				'about',
				...DEFAULT_SECTION_ORDER.filter((id) => id !== 'skills' && id !== 'about'),
			]);
		});
	});

	describe('given an order with repeats, blanks or unknown names', () => {
		it('shows each section once and ignores anything unknown', () => {
			const order = resolveSectionOrder(['about', null, 'about', 'nonsense', 'projects']);
			expect(order.slice(0, 2)).toEqual(['about', 'projects']);
			expect(order).toHaveLength(DEFAULT_SECTION_ORDER.length);
			expect(new Set(order).size).toBe(order.length);
		});
	});

	it('gives every section a title editors can recognise', () => {
		for (const id of DEFAULT_SECTION_ORDER) {
			expect(HOME_SECTIONS[id].title.length).toBeGreaterThan(0);
		}
	});
});
