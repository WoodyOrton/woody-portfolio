import { defineArrayMember, defineField, defineType } from 'sanity';

export const cv = defineType({
	name: 'cv',
	title: 'Education, previous jobs and hobbies',
	type: 'document',
	fields: [
		defineField({
			name: 'previousJobs',
			title: 'Previous jobs',
			description:
				'Earlier jobs that need only a few lines. Newest first: drag to reorder. For anything that deserves a full page, add it under Experience instead.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'previousJobEntry',
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
							name: 'period',
							title: 'Dates',
							description: 'For example Jun – Sep 2024, or 2023 – Present.',
							type: 'string',
							validation: (rule) => rule.required().max(30),
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
							title: 'What you did',
							description:
								'Optional. One or two sentences. Start with a verb and include a number if you can, for example "Cut test setup time by a third".',
							type: 'text',
							rows: 3,
							validation: (rule) => rule.max(200),
						}),
					],
					preview: { select: { title: 'role', subtitle: 'organisation' } },
				}),
			],
			validation: (rule) => rule.max(12),
		}),
		defineField({
			name: 'qualifications',
			title: 'Education',
			description: 'Degrees and school qualifications. Newest first: drag to reorder.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'qualificationEntry',
					fields: [
						defineField({
							name: 'qualification',
							title: 'Qualification',
							description:
								'For example BEng Automotive Engineering, or A-levels with the subjects.',
							type: 'string',
							validation: (rule) => rule.required().max(80),
						}),
						defineField({
							name: 'institution',
							title: 'School or university',
							type: 'string',
							validation: (rule) => rule.required().max(80),
						}),
						defineField({
							name: 'period',
							title: 'Dates',
							description: 'For example 2022 – 2026.',
							type: 'string',
							validation: (rule) => rule.required().max(30),
						}),
						defineField({
							name: 'grade',
							title: 'Grade',
							description:
								'Optional. For example First-class honours (expected), 2:1, or A*AA. Say "expected" if you have not finished.',
							type: 'string',
							validation: (rule) => rule.max(40),
						}),
						defineField({
							name: 'detail',
							title: 'Detail',
							description: 'Optional. A dissertation title or key modules, in one line.',
							type: 'text',
							rows: 2,
							validation: (rule) => rule.max(200),
						}),
					],
					preview: { select: { title: 'qualification', subtitle: 'institution' } },
				}),
			],
			validation: (rule) => rule.max(6),
		}),
		defineField({
			name: 'hobbies',
			title: 'Hobbies',
			description: 'Things you do outside work and study. Drag to reorder.',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'hobbyEntry',
					fields: [
						defineField({
							name: 'name',
							title: 'Hobby',
							description: 'For example Karting.',
							type: 'string',
							validation: (rule) => rule.required().max(60),
						}),
						defineField({
							name: 'period',
							title: 'Dates',
							description: 'Optional. For example Since 2018.',
							type: 'string',
							validation: (rule) => rule.max(30),
						}),
						defineField({
							name: 'description',
							title: 'Detail',
							description: 'Optional. One or two sentences.',
							type: 'text',
							rows: 3,
							validation: (rule) => rule.max(200),
						}),
					],
					preview: { select: { title: 'name', subtitle: 'period' } },
				}),
			],
			validation: (rule) => rule.max(10),
		}),
		defineField({
			name: 'cvFile',
			title: 'CV (PDF)',
			description:
				'Upload your CV as a PDF, ideally two pages or fewer. A download button appears under Education.',
			type: 'file',
			options: { accept: 'application/pdf' },
		}),
	],
	preview: { prepare: () => ({ title: 'Education, previous jobs and hobbies' }) },
});
