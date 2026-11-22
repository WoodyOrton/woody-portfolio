import { defineField, defineType } from 'sanity';

export const experience = defineType({
	name: 'experience',
	title: 'Experience',
	type: 'document',
	fields: [
		defineField({
			name: 'role',
			title: 'Role',
			description: 'For example Placement engineer.',
			type: 'string',
			validation: (rule) => rule.required().max(80),
		}),
		defineField({
			name: 'organisation',
			title: 'Organisation',
			type: 'string',
			validation: (rule) => rule.required().max(80),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			description: 'The end of the page address. Click Generate and leave it as it is.',
			type: 'slug',
			options: {
				source: (doc) => `${doc.role ?? ''} ${doc.organisation ?? ''}`.trim(),
				maxLength: 96,
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'period',
			title: 'Dates',
			description: 'Shown as written. For example Jun – Sep 2024, or 2023 – Present.',
			type: 'string',
			validation: (rule) => rule.required().max(30),
		}),
		defineField({
			name: 'startDate',
			title: 'Start date',
			description: 'Only used to put the newest experience first. The day does not matter.',
			type: 'date',
			options: { dateFormat: 'MMM YYYY' },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'location',
			title: 'Location',
			description: 'Optional. A town or city.',
			type: 'string',
			validation: (rule) => rule.max(60),
		}),
		defineField({
			name: 'description',
			title: 'Summary',
			description:
				'Optional. One or two sentences shown in the list on the home page. Start with a verb and include a number if you can, for example "Cut test setup time by a third".',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.max(200),
		}),
		defineField({
			name: 'blocks',
			title: 'Page content',
			description: 'Build the full page from these parts. Drag to reorder.',
			type: 'array',
			of: [{ type: 'heading' }, { type: 'richText' }, { type: 'imageSet' }],
		}),
	],
	orderings: [
		{
			title: 'Newest first',
			name: 'startDateDesc',
			by: [{ field: 'startDate', direction: 'desc' }],
		},
	],
	preview: { select: { title: 'role', subtitle: 'organisation' } },
});
