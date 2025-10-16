"use client";
import { useEffect, useMemo, useState } from 'react';
import type { Arrival } from '@/lib/types';
import { formatDay } from '@/lib/utils';
import DayGroup from './DayGroup';
import FilterComponent from './FilterComponent';

interface FilterState {
  dayOfWeek: string;
  timeTag: string;
  from: string;
  to: string;
}

function Skeleton() {
	return (
		<div className="animate-pulse space-y-2">
			<div className="h-4 w-32 bg-gray-200 rounded" />
			<div className="h-16 w-full bg-gray-200 rounded" />
			<div className="h-16 w-full bg-gray-200 rounded" />
		</div>
	);
}

export default function Timeline() {
	const [arrivals, setArrivals] = useState<Arrival[] | null>(null);
	const [filters, setFilters] = useState<FilterState>({
		dayOfWeek: '',
		timeTag: '',
		from: '',
		to: ''
	});

	async function load() {
		const params = new URLSearchParams();
		if (filters.from) params.set('from', new Date(filters.from).toISOString());
		if (filters.to) params.set('to', new Date(filters.to).toISOString());
		if (filters.dayOfWeek) params.set('dayOfWeek', filters.dayOfWeek);
		if (filters.timeTag) params.set('timeTag', filters.timeTag);
		
		const res = await fetch(`/api/arrival?${params.toString()}`);
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to load');
		setArrivals(data.arrivals);
	}

	useEffect(() => {
		load();
		const onChanged = () => load();
		window.addEventListener('arrivals:changed', onChanged as any);
		return () => window.removeEventListener('arrivals:changed', onChanged as any);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFilter = (newFilters: FilterState) => {
		setFilters(newFilters);
		// Load will be triggered by useEffect when filters change
	};

	const handleClearFilters = () => {
		setFilters({ dayOfWeek: '', timeTag: '', from: '', to: '' });
	};

	// Reload when filters change
	useEffect(() => {
		load();
	}, [filters]);

	const groups = useMemo(() => {
		if (!arrivals) return [] as { label: string; items: Arrival[] }[];
		const by: Record<string, Arrival[]> = {};
		for (const a of arrivals) {
			const key = new Date(a.timestamp).toISOString().slice(0, 10);
			(by[key] ||= []).push(a);
		}
		const out = Object.entries(by).map(([k, v]) => ({ label: formatDay(new Date(k)), items: v })).sort((a, b) => a.label < b.label ? 1 : -1);
		return out;
	}, [arrivals]);

	return (
		<section className="space-y-3">
			<FilterComponent onFilter={handleFilter} onClear={handleClearFilters} />
			
			{arrivals === null ? (
				<Skeleton />
			) : groups.length === 0 ? (
				<div className="text-center py-12">
					<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-cyan-400/30">
						<svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
					</div>
					<p className="text-sm text-white/60 mb-2">No arrivals found matching your filters.</p>
					{filters.dayOfWeek || filters.timeTag || filters.from || filters.to ? (
						<button
							onClick={handleClearFilters}
							className="mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
						>
							Clear filters to see all arrivals
						</button>
					) : (
						<p className="text-sm text-white/40 mt-2">Add your first arrival to get started!</p>
					)}
				</div>
			) : (
				<div className="space-y-2">
					{groups.map(g => (
						<DayGroup key={g.label} dateLabel={g.label} items={g.items} onDeleted={() => load()} />
					))}
				</div>
			)}
		</section>
	);
}
