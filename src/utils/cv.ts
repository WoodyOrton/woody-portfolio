import type { Cv, ExperienceEntry, HobbyEntry, QualificationEntry, RawCv } from './cv.types';

/** Treats null and empty strings from Sanity as "not filled in". */
const filled = (value: string | null | undefined) => (value?.trim() ? value : undefined);

/** Used for previous jobs and for experience pages. An entry that is missing a required field is dropped. */
export const experienceEntry = (raw: Partial<ExperienceEntry>): ExperienceEntry[] => {
	const role = filled(raw.role);
	const organisation = filled(raw.organisation);
	const period = filled(raw.period);
	if (!raw._key || !role || !organisation || !period) return [];
	return [
		{
			_key: raw._key,
			role,
			organisation,
			period,
			location: filled(raw.location),
			description: filled(raw.description),
			...(filled(raw.slug) ? { slug: raw.slug } : {}),
		},
	];
};

const hobbyEntry = (raw: Partial<HobbyEntry>): HobbyEntry[] => {
	const name = filled(raw.name);
	if (!raw._key || !name) return [];
	return [
		{
			_key: raw._key,
			name,
			period: filled(raw.period),
			description: filled(raw.description),
		},
	];
};

const qualificationEntry = (raw: Partial<QualificationEntry>): QualificationEntry[] => {
	const qualification = filled(raw.qualification);
	const institution = filled(raw.institution);
	const period = filled(raw.period);
	if (!raw._key || !qualification || !institution || !period) return [];
	return [
		{
			_key: raw._key,
			qualification,
			institution,
			period,
			grade: filled(raw.grade),
			detail: filled(raw.detail),
		},
	];
};

/** Entries missing a required field are dropped so the page never shows half an entry. */
export const resolveCv = (raw: RawCv | null): Cv => ({
	previousJobs: (raw?.previousJobs ?? []).flatMap(experienceEntry),
	qualifications: (raw?.qualifications ?? []).flatMap(qualificationEntry),
	hobbies: (raw?.hobbies ?? []).flatMap(hobbyEntry),
	...(raw?.cvFile?.url
		? { cvFile: { url: raw.cvFile.url, ...(raw.cvFile.size ? { size: raw.cvFile.size } : {}) } }
		: {}),
});

export const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
};
