"use client";
import { useEffect, useState } from 'react';
import type { Arrival } from '@/lib/types';
import WeeklyChart from './WeeklyChart';

export default function SummaryCard() {
	const [arrivals, setArrivals] = useState<Arrival[] | null>(null);
	async function load() {
		const res = await fetch('/api/arrival?limit=1000');
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to load');
		setArrivals(data.arrivals);
	}
	useEffect(() => {
		load();
		const onChanged = () => load();
		window.addEventListener('arrivals:changed', onChanged as any);
		return () => window.removeEventListener('arrivals:changed', onChanged as any);
	}, []);

	return (
		<section>
			{/* Weekly Chart Section */}
			{arrivals && <WeeklyChart arrivals={arrivals} />}
		</section>
	);
}
