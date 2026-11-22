import type { Experience } from '../../utils/experience.types';

export const minimalExperience: Experience = {
	_key: 'minimal',
	slug: 'minimal',
	role: 'Placement engineer',
	organisation: 'Ford, Dunton',
	period: 'Jun – Sep 2024',
	blocks: [],
};

export const fullExperience: Experience = {
	...minimalExperience,
	_key: 'full',
	slug: 'full',
	location: 'Essex',
	description: 'Ran brake fade tests.',
	blocks: [
		{ _type: 'heading', _key: 'a', text: 'The team', level: 'section' },
		{ _type: 'heading', _key: 'b', text: 'Test rig', level: 'subsection' },
		{ _type: 'heading', _key: 'c', text: 'Results', level: 'section' },
	],
};

export const longTitleExperience: Experience = {
	...minimalExperience,
	slug: 'long',
	role: 'Graduate powertrain calibration and emissions compliance engineer, hybrid programmes',
};
