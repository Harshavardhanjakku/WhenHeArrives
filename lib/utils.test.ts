import { formatDate, groupByDay, toCSV } from './utils';

describe('utils', () => {
	it('formats date', () => {
		const d = new Date('2025-01-02T03:04:00Z');
		expect(typeof formatDate(d)).toBe('string');
	});
	it('groups by day', () => {
		const arrivals: any[] = [
			{ _id: '1', timestamp: new Date('2025-01-01T10:00:00Z') },
			{ _id: '2', timestamp: new Date('2025-01-01T12:00:00Z') },
			{ _id: '3', timestamp: new Date('2025-01-02T12:00:00Z') },
		];
		const g = groupByDay(arrivals as any);
		expect(Object.keys(g).length).toBe(2);
		expect(g['2025-01-01'].length).toBe(2);
	});
	it('exports CSV', () => {
		const csv = toCSV([{ _id: '1', timestamp: new Date('2025-01-01T10:00:00Z'), note: 'x' } as any]);
		expect(csv).toContain('timestamp');
		expect(csv.split('\n').length).toBe(2);
	});
});
