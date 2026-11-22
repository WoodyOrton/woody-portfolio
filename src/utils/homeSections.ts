/** The home page sections below the hero. The hero and the contact footer are fixed in place. */
export const HOME_SECTIONS = {
	projects: { title: 'Projects' },
	about: { title: 'About' },
	experience: { title: 'Experience' },
	previousJobs: { title: 'Previous jobs' },
	education: { title: 'Education' },
	cvDownload: { title: 'CV download' },
	skills: { title: 'Skills and tools' },
	hobbies: { title: 'Hobbies' },
} as const;

export type HomeSectionId = keyof typeof HOME_SECTIONS;

export const DEFAULT_SECTION_ORDER = Object.keys(HOME_SECTIONS) as HomeSectionId[];

const isSectionId = (value: unknown): value is HomeSectionId =>
	typeof value === 'string' && Object.hasOwn(HOME_SECTIONS, value);

/**
 * Turns the editor's chosen order into a full list: repeats and unknown names are dropped, and any
 * section the editor left out is added at the end in the standard order, so nothing disappears.
 */
export const resolveSectionOrder = (
	chosen: (string | null)[] | null | undefined,
): HomeSectionId[] => {
	const ordered = [...new Set((chosen ?? []).filter(isSectionId))];
	return [...ordered, ...DEFAULT_SECTION_ORDER.filter((id) => !ordered.includes(id))];
};
