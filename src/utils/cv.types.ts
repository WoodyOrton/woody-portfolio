export interface ExperienceEntry {
	_key: string;
	role: string;
	organisation: string;
	/** Free text, for example "Jun 2024 – Sep 2024" or "2023 – Present". */
	period: string;
	location?: string;
	description?: string;
	/** Set when the entry has its own page, at /experience/<slug>. */
	slug?: string;
}

export interface HobbyEntry {
	_key: string;
	name: string;
	/** Free text, for example "Since 2018". */
	period?: string;
	description?: string;
}

export interface QualificationEntry {
	_key: string;
	qualification: string;
	institution: string;
	period: string;
	/** For example "First-class honours (expected)" or "2:1". */
	grade?: string;
	detail?: string;
}

export interface CvFile {
	url: string;
	/** Size in bytes. */
	size?: number;
}

export interface Cv {
	/** Short earlier jobs: listed on the home page, with no page of their own. */
	previousJobs: ExperienceEntry[];
	qualifications: QualificationEntry[];
	hobbies: HobbyEntry[];
	cvFile?: CvFile;
}

/** What Sanity returns: entries may be missing fields and unset values come back as null. */
export interface RawCv {
	previousJobs?: Partial<ExperienceEntry>[] | null;
	qualifications?: Partial<QualificationEntry>[] | null;
	hobbies?: Partial<HobbyEntry>[] | null;
	cvFile?: { url?: string | null; size?: number | null } | null;
}
