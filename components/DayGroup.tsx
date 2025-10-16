"use client";
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import type { Arrival } from '@/lib/types';
import { Trash2, Edit2, Save, X } from 'lucide-react';

export default function DayGroup({ dateLabel, items, onDeleted }: { dateLabel: string; items: Arrival[]; onDeleted: () => void; }) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editData, setEditData] = useState<{ timestamp: string; note: string }>({ timestamp: '', note: '' });

	async function remove(id: string) {
		const res = await fetch(`/api/arrival/${id}`, { method: 'DELETE' });
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to delete');
		onDeleted();
	}

	async function update(id: string) {
		const res = await fetch(`/api/arrival/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				timestamp: editData.timestamp,
				note: editData.note,
				source: 'manual'
			}),
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to update');
		setEditingId(null);
		onDeleted();
	}

	function startEdit(item: Arrival) {
		const date = new Date(item.timestamp);
		setEditData({
			timestamp: date.toISOString().slice(0, 16),
			note: item.note || ''
		});
		setEditingId(String(item._id));
	}

	function cancelEdit() {
		setEditingId(null);
		setEditData({ timestamp: '', note: '' });
	}

	return (
		<section className="space-y-3">
			<h3 className="text-lg font-bold text-white mt-6 flex items-center gap-2">
				<div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
				{dateLabel}
			</h3>
			<ul className="space-y-3">
				{items.map(a => (
					<li key={String(a._id)} className="flex items-start justify-between rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-xl p-4">
						{editingId === String(a._id) ? (
							<div className="flex-1 space-y-2">
								<div className="grid gap-2 sm:grid-cols-2">
									<input
										type="datetime-local"
										value={editData.timestamp}
										onChange={(e) => setEditData(prev => ({ ...prev, timestamp: e.target.value }))}
									className="rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
									/>
									<input
										type="text"
										value={editData.note}
										onChange={(e) => setEditData(prev => ({ ...prev, note: e.target.value }))}
										placeholder="Note (optional)"
									className="rounded-xl bg-white/10 border border-white/15 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
									/>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => update(String(a._id))}
									className="inline-flex items-center gap-1 px-3 py-1 bg-green-600/90 hover:bg-green-600 text-white rounded-xl text-sm transition-colors"
									>
										<Save className="w-3 h-3" />
										Save
									</button>
									<button
										onClick={cancelEdit}
									className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-sm transition-colors"
									>
										<X className="w-3 h-3" />
										Cancel
									</button>
								</div>
							</div>
						) : (
							<>
								<div className="flex-1">
									<div className="font-medium text-white/90">{formatDate(new Date(a.timestamp))}</div>
									{(a as any).dayOfWeek && (
										<div className="text-xs text-white/60 mt-1">
											<span className="font-medium">{(a as any).dayOfWeek}</span>
										</div>
									)}
									{(a as any).note ? <div className="text-sm text-white/70">{(a as any).note}</div> : null}
									{(a as any).timeTag && (
										<div className="text-xs mt-1">
											<span className={`px-2 py-1 rounded-full text-xs font-medium border ${
												(a as any).timeTag === 'fast' ? 'bg-green-500/10 text-green-300 border-green-400/20' :
												(a as any).timeTag === 'late' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-400/20' :
												'bg-red-500/10 text-red-300 border-red-400/20'
											}`}> 
												{(a as any).timeTag === 'fast' ? 'Fast' :
												 (a as any).timeTag === 'late' ? 'Late' : 'Very Late'}
											</span>
										</div>
									)}
								</div>
								<div className="flex gap-1">
									<button 
										aria-label="Edit" 
										onClick={() => startEdit(a)} 
									className="text-white/80 hover:text-white p-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
									>
										<Edit2 className="w-4 h-4" />
									</button>
									<button 
										aria-label="Delete" 
										onClick={() => remove(String(a._id))} 
									className="text-white/80 hover:text-white p-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</>
						)}
					</li>
				))}
			</ul>
		</section>
	);
}
