"use client";
import { useEffect, useMemo, useState } from 'react';
import type { Arrival } from '@/lib/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AnalyticsView() {
	const [arrivals, setArrivals] = useState<Arrival[] | null>(null);
	useEffect(() => {
		(async () => {
			const res = await fetch('/api/arrival?limit=2000');
			const data = await res.json();
			if (res.ok) setArrivals(data.arrivals);
		})();
	}, []);

	const counts = useMemo(() => {
		const arr = Array(7).fill(0) as number[];
		for (const a of arrivals || []) arr[new Date(a.timestamp).getDay()]++;
		return arr;
	}, [arrivals]);

	const max = Math.max(1, ...counts);

	return (
		<div className="bg-white rounded-lg border p-4">
			<h2 className="font-medium mb-3">Busiest days of week</h2>
			<div className="grid grid-cols-7 gap-2">
				{counts.map((c, i) => (
					<div key={i} className="text-center">
						<div className="text-xs text-gray-600 mb-1">{DAYS[i]}</div>
						<div className="mx-auto bg-gray-200 rounded w-8 h-24 relative">
							<div className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded" style={{ height: `${(c / max) * 100}%` }} />
						</div>
						<div className="text-xs mt-1">{c}</div>
					</div>
				))}
			</div>
		</div>
	);
}
