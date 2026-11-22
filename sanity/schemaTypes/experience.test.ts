import { describe, expect, it } from 'vitest';
import { experience } from './experience';

interface FieldDef {
	name: string;
	type: string;
	validation?: (rule: unknown) => unknown;
	of?: { type: string }[];
}

const fields = (experience as unknown as { fields: FieldDef[] }).fields;
const field = (name: string) => fields.find((f) => f.name === name);

/** Records which rules a field's validation asks for. */
const rulesOf = (def: FieldDef | undefined) => {
	const calls: string[] = [];
	const rule: Record<string, (...args: unknown[]) => unknown> = new Proxy(
		{},
		{
			get:
				(_t, key: string) =>
				(...args: unknown[]) => {
					calls.push(args.length ? `${key}(${args.join(',')})` : key);
					return rule;
				},
		},
	);
	def?.validation?.(rule);
	return calls;
};

describe('Experience schema', () => {
	it('is a document called experience', () => {
		expect(experience.type).toBe('document');
		expect(experience.name).toBe('experience');
	});

	it('keeps the field names the old experience list used, so entries can be copied across', () => {
		for (const name of ['role', 'organisation', 'period', 'location', 'description']) {
			expect(field(name)).toBeDefined();
		}
	});

	it('requires a role, organisation, dates, start date and slug', () => {
		for (const name of ['role', 'organisation', 'period', 'startDate', 'slug']) {
			expect(rulesOf(field(name))).toContain('required');
		}
	});

	it('orders by a start date, so the list is newest first without dragging', () => {
		expect(field('startDate')?.type).toBe('date');
	});

	it('keeps the summary short', () => {
		expect(rulesOf(field('description'))).toContain('max(200)');
	});

	it('builds the page from the same blocks as a project', () => {
		expect(field('blocks')?.of?.map((m) => m.type)).toEqual(['heading', 'richText', 'imageSet']);
	});
});
