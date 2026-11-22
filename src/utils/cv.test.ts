import { describe, expect, it } from 'vitest';
import { CV_QUERY } from './sanity';
import { formatFileSize, resolveCv } from './cv';
import { bartender, degree, full, karting, saturdayJob } from './cv.fixture';

describe('CV query', () => {
	it('looks up the single experience and education document', () => {
		expect(CV_QUERY).toContain('_type == "cv"');
		expect(CV_QUERY).toContain('[0]');
	});

	it('no longer fetches the old experience list, which now has a page each', () => {
		expect(CV_QUERY).not.toContain('experience[]');
	});

	it('fetches the previous jobs and hobbies the site shows', () => {
		expect(CV_QUERY).toContain('previousJobs[]');
		expect(CV_QUERY).toContain('hobbies[]');
		for (const field of ['name', 'period', 'description']) {
			expect(CV_QUERY).toContain(field);
		}
	});

	it('fetches each previous job and qualification field the site shows', () => {
		for (const field of [
			'role',
			'organisation',
			'period',
			'location',
			'description',
			'qualification',
			'institution',
			'grade',
			'detail',
		]) {
			expect(CV_QUERY).toContain(field);
		}
	});

	it('fetches the CV file url and size', () => {
		expect(CV_QUERY).toContain('cvFile.asset->');
		expect(CV_QUERY).toContain('url');
		expect(CV_QUERY).toContain('size');
	});
});

describe('CV data', () => {
	describe('given no document', () => {
		it('has no entries and no file', () => {
			expect(resolveCv(null)).toEqual({ previousJobs: [], qualifications: [], hobbies: [] });
		});
	});

	describe('given a complete document', () => {
		it('keeps the entries and the file, in order', () => {
			expect(resolveCv(full)).toEqual(full);
		});
	});

	describe('given entries that are missing required fields', () => {
		const cv = resolveCv({
			previousJobs: [{ _key: 'a', role: 'Engineer' }, saturdayJob],
			qualifications: [{ _key: 'b', qualification: 'BEng', institution: 'Uni' }, degree],
			hobbies: [{ _key: 'c', description: 'No name' }, karting],
		});

		it('leaves them out', () => {
			expect(cv.previousJobs).toEqual([saturdayJob]);
			expect(cv.qualifications).toEqual([degree]);
			expect(cv.hobbies).toEqual([karting]);
		});
	});

	describe('given blank optional fields', () => {
		it('treats them as not filled in', () => {
			const cv = resolveCv({
				previousJobs: [{ ...saturdayJob, location: ' ', description: '' }],
				hobbies: [{ ...karting, period: ' ', description: '' }],
			});
			expect(cv.previousJobs[0]?.location).toBeUndefined();
			expect(cv.previousJobs[0]?.description).toBeUndefined();
			expect(cv.hobbies[0]?.period).toBeUndefined();
			expect(cv.hobbies[0]?.description).toBeUndefined();
		});

		it('keeps a job or hobby that has only its required fields', () => {
			const cv = resolveCv({ previousJobs: [bartender], hobbies: [{ _key: 'x', name: 'Chess' }] });
			expect(cv.previousJobs).toEqual([bartender]);
			expect(cv.hobbies).toEqual([{ _key: 'x', name: 'Chess' }]);
		});
	});

	describe('given a CV file with no url', () => {
		it('has no file', () => {
			expect(resolveCv({ cvFile: { url: null, size: null } }).cvFile).toBeUndefined();
			expect(resolveCv({ cvFile: null }).cvFile).toBeUndefined();
		});
	});
});

describe('File size', () => {
	it('shows bytes, kilobytes and megabytes in plain units', () => {
		expect(formatFileSize(512)).toBe('512 B');
		expect(formatFileSize(150 * 1024)).toBe('150 KB');
		expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB');
	});
});
