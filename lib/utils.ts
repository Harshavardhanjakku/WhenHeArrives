import { type Arrival } from './types';

export function formatDate(date: Date): string {
	return date.toLocaleString(undefined, {
		year: 'numeric', month: 'short', day: '2-digit',
		hour: 'numeric', minute: '2-digit'
	});
}

export function formatDay(date: Date): string {
	return date.toLocaleDateString(undefined, {
		year: 'numeric', month: 'short', day: '2-digit'
	});
}

export function groupByDay(arrivals: Arrival[]): Record<string, Arrival[]> {
	return arrivals.reduce<Record<string, Arrival[]>>((acc, a) => {
		const key = new Date(a.timestamp).toISOString().slice(0, 10);
		(acc[key] ||= []).push(a);
		return acc;
	}, {});
}

export function countByDay(arrivals: Arrival[]): { day: string; count: number }[] {
	const grouped = groupByDay(arrivals);
	return Object.entries(grouped)
		.map(([k, v]) => ({ day: k, count: v.length }))
		.sort((a, b) => a.day < b.day ? 1 : -1);
}

export function miniBar(values: number[], maxWidth = 20): string {
	if (values.length === 0) return '';
	const max = Math.max(...values) || 1;
	return values.map(v => '█'.repeat(Math.max(1, Math.round((v / max) * maxWidth)))).join(' ');
}

export function toCSV(arrivals: Arrival[]): string {
	const header = 'id,timestamp,note,source';
	const rows = arrivals.map(a => [
		String(a._id),
		new Date(a.timestamp).toISOString(),
		(a as any).note ?? '',
		(a as any).source ?? ''
	].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));
	return [header, ...rows].join('\n');
}
