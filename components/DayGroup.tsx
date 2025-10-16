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
				<div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
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
										className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
									/>
									<input
										type="text"
										value={editData.note}
										onChange={(e) => setEditData(prev => ({ ...prev, note: e.target.value }))}
										placeholder="Note (optional)"
										className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
									/>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => update(String(a._id))}
										className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
									>
										<Save className="w-3 h-3" />
										Save
									</button>
									<button
										onClick={cancelEdit}
										className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
									>
										<X className="w-3 h-3" />
										Cancel
									</button>
								</div>
							</div>
						) : (
							<>
								<div className="flex-1">
									<div className="font-medium">{formatDate(new Date(a.timestamp))}</div>
									{(a as any).dayOfWeek && (
										<div className="text-xs text-gray-500 mt-1">
											<span className="font-medium">{(a as any).dayOfWeek}</span>
										</div>
									)}
									{(a as any).note ? <div className="text-sm text-gray-600">{(a as any).note}</div> : null}
									{(a as any).timeTag && (
										<div className="text-xs mt-1">
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${
												(a as any).timeTag === 'fast' ? 'bg-green-100 text-green-700' :
												(a as any).timeTag === 'late' ? 'bg-yellow-100 text-yellow-700' :
												'bg-red-100 text-red-700'
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
										className="text-blue-600 hover:text-blue-700 p-1.5 rounded hover:bg-blue-50 transition-colors"
									>
										<Edit2 className="w-4 h-4" />
									</button>
									<button 
										aria-label="Delete" 
										onClick={() => remove(String(a._id))} 
										className="text-red-600 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
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
