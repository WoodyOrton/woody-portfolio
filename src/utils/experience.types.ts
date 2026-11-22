import type { Block } from './project.types';
import type { ExperienceEntry } from './cv.types';

/** What the experience list on the home page needs. Every entry here has a page. */
export interface ExperienceSummary extends ExperienceEntry {
	slug: string;
}

export interface Experience extends ExperienceSummary {
	blocks: Block[];
}
