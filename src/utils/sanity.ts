import { sanityClient } from 'sanity:client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { defineQuery } from 'groq';
import type { Block, Project, ProjectSummary } from './project.types';
import { experienceEntry, resolveCv } from './cv';
import type { ExperienceEntry, RawCv } from './cv.types';
import type { Experience, ExperienceSummary } from './experience.types';
import { resolveSiteSettings } from './siteSettings';
import type { RawSiteSettings } from './siteSettings.types';

const builder = createImageUrlBuilder(sanityClient);

type ImageSource = Parameters<typeof builder.image>[0];

export const imageUrl = (
	source: ImageSource,
	{ width, height }: { width: number; height?: number },
) => {
	const image = builder.image(source).width(width).auto('format');
	return (height ? image.height(height) : image).url();
};

export const imageSrcSet = (source: ImageSource, widths: number[]) =>
	widths.map((width) => `${imageUrl(source, { width })} ${width}w`).join(', ');

/** The page-builder blocks, shared by every document that has a "Page content" field. */
const BLOCKS_PROJECTION = `blocks[]{
		_type,
		_key,
		_type == "heading" => { text, level },
		_type == "richText" => { body },
		_type == "imageSet" => {
			layout,
			images[]{
				_key,
				alt,
				caption,
				hotspot,
				crop,
				asset->{ _id, metadata { lqip, dimensions { width, height } } }
			}
		}
	}`;

export const PROJECTS_QUERY =
	defineQuery(`*[_type == "project" && defined(slug.current)] | order(coalesce(orderRank, "~") asc, year desc, title asc){
	title,
	"slug": slug.current,
	system,
	year,
	context,
	cover{
		alt,
		hotspot,
		crop,
		asset->{ _id, metadata { lqip, dimensions { width, height } } }
	}
}`);

export const PROJECT_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
	title,
	"slug": slug.current,
	system,
	year,
	context,
	${BLOCKS_PROJECTION}
}`);

type RawProject = Omit<Project, 'blocks'> & { blocks: Block[] | null };

/** Sanity returns null for an array that has never been set; pages expect a list. */
export const toProject = (raw: RawProject | null): Project | null =>
	raw ? { ...raw, blocks: raw.blocks ?? [] } : null;

export const getProjects = () => sanityClient.fetch<ProjectSummary[]>(PROJECTS_QUERY);

export const getProject = async (slug: string) =>
	toProject(await sanityClient.fetch<RawProject | null>(PROJECT_QUERY, { slug }));

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
	name,
	statement,
	details[]{ _key, label, value },
	skills,
	roleLine,
	availabilityLine,
	about,
	profileImage{
		alt,
		hotspot,
		crop,
		asset->{ _id, metadata { lqip, dimensions { width, height } } }
	},
	email,
	linkedinUrl,
	contactHeading,
	siteTitle,
	siteDescription
}`);

export const getSiteSettings = async () =>
	resolveSiteSettings(await sanityClient.fetch<RawSiteSettings | null>(SITE_SETTINGS_QUERY));

export const EXPERIENCES_QUERY =
	defineQuery(`*[_type == "experience" && defined(slug.current)] | order(startDate desc, role asc){
	"_key": _id,
	role,
	organisation,
	period,
	location,
	description,
	"slug": slug.current
}`);

export const EXPERIENCE_QUERY = defineQuery(`*[_type == "experience" && slug.current == $slug][0]{
	"_key": _id,
	role,
	organisation,
	period,
	location,
	description,
	"slug": slug.current,
	${BLOCKS_PROJECTION}
}`);

type RawExperience = Partial<ExperienceEntry> & { blocks?: Block[] | null };

/** Entries missing a required field are dropped, so the home page never links to a half-filled page. */
export const toExperienceSummaries = (
	raw: Partial<ExperienceEntry>[] | null,
): ExperienceSummary[] =>
	(raw ?? []).flatMap(experienceEntry).filter((entry): entry is ExperienceSummary => !!entry.slug);

export const toExperience = (raw: RawExperience | null): Experience | null => {
	if (!raw) return null;
	const [summary] = toExperienceSummaries([raw]);
	return summary ? { ...summary, blocks: raw.blocks ?? [] } : null;
};

export const getExperiences = async () =>
	toExperienceSummaries(
		await sanityClient.fetch<Partial<ExperienceEntry>[] | null>(EXPERIENCES_QUERY),
	);

export const getExperience = async (slug: string) =>
	toExperience(await sanityClient.fetch<RawExperience | null>(EXPERIENCE_QUERY, { slug }));

export const CV_QUERY = defineQuery(`*[_type == "cv"][0]{
	previousJobs[]{ _key, role, organisation, period, location, description },
	qualifications[]{ _key, qualification, institution, period, grade, detail },
	hobbies[]{ _key, name, period, description },
	"cvFile": cvFile.asset->{ url, size }
}`);

export const getCv = async () => resolveCv(await sanityClient.fetch<RawCv | null>(CV_QUERY));
