"use client";
import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Toast, { useToast } from './Toast';

export default function AddArrival() {
	const { msg, show } = useToast();
	const [timestamp, setTimestamp] = useState<string>('');
	const [note, setNote] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState<string>('');
	const [selectedTime, setSelectedTime] = useState<string>('');

	function getIstDefaults() {
		const now = new Date();
		const date = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Asia/Kolkata',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}).format(now); // YYYY-MM-DD
		const time = new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Asia/Kolkata',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		}).format(now); // HH:MM
		return { date, time };
	}

	function isoFromIst(dateStr: string, timeStr: string) {
		if (!dateStr || !timeStr) return '';
		const [y, m, d] = dateStr.split('-').map(Number);
		const [hh, mm] = timeStr.split(':').map(Number);
		const utc = new Date(Date.UTC(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0));
		// Convert IST (UTC+5:30) to UTC by subtracting 330 minutes
		utc.setUTCMinutes(utc.getUTCMinutes() - 330);
		return utc.toISOString();
	}

	useEffect(() => {
		const { date, time } = getIstDefaults();
		setSelectedDate(date);
		setSelectedTime(time);
		setTimestamp(isoFromIst(date, time).slice(0, 16));
	}, []);

	const combinedTimestamp = useMemo(() => {
		if (selectedDate && selectedTime) {
			return isoFromIst(selectedDate, selectedTime);
		}
		return timestamp;
	}, [selectedDate, selectedTime, timestamp]);

	async function create(body: any) {
		setLoading(true);
		try {
			const res = await fetch('/api/arrival', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to add');
			show('Saved');
			window.dispatchEvent(new CustomEvent('arrivals:changed'));
		} catch (e: any) {
			show(e.message || 'Error');
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className="space-y-4">
			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="bg-black/50 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-6"
			>
				<h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
					<Calendar className="w-5 h-5 text-white/80" />
					Add Arrival
				</h2>
				<form 
					className="space-y-4" 
					onSubmit={(e) => { 
						e.preventDefault(); 
						create({ timestamp: combinedTimestamp, note, source: 'manual' }); 
					}}
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<motion.div 
							whileFocus={{ scale: 1.02 }}
							className="space-y-2"
						>
						<label className="text-sm font-medium text-white/80 flex items-center gap-2">
							<Calendar className="w-4 h-4 text-white/70" />
								Date
							</label>
							<input 
								type="date" 
								value={selectedDate} 
								onChange={(e) => setSelectedDate(e.target.value)} 
							className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 px-4 transition-all duration-300" 
								required 
							/>
						</motion.div>
						<motion.div 
							whileFocus={{ scale: 1.02 }}
							className="space-y-2"
						>
						<label className="text-sm font-medium text-white/80 flex items-center gap-2">
							<Clock className="w-4 h-4 text-white/70" />
								Time
							</label>
							<input 
								type="time" 
								value={selectedTime} 
								onChange={(e) => setSelectedTime(e.target.value)} 
							className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 px-4 transition-all duration-300" 
								required 
							/>
						</motion.div>
					</div>
					<motion.div 
						whileFocus={{ scale: 1.02 }}
						className="space-y-2"
					>
						<label className="text-sm font-medium text-white/80">Note (optional)</label>
						<input 
							value={note} 
							onChange={(e) => setNote(e.target.value)} 
						className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 px-4 transition-all duration-300" 
							placeholder="E.g., came with groceries" 
						/>
					</motion.div>
					<motion.button 
						whileHover={{ scale: 1.02, y: -2 }}
						whileTap={{ scale: 0.98 }}
						disabled={loading} 
					className="w-full h-12 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold border border-white/10 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						<Save className="w-4 h-4" /> 
						{loading ? 'Saving...' : 'Save Arrival'}
					</motion.button>
				</form>
			</motion.div>

			<motion.button 
				whileHover={{ scale: 1.1, rotate: 90 }}
				whileTap={{ scale: 0.9 }}
				aria-label="Fast add arrival now" 
				onClick={() => create({})} 
			className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 shadow-2xl shadow-black/40 transition-all duration-300 flex items-center justify-center"
			>
				<Plus className="w-6 h-6" />
			</motion.button>
			<Toast message={msg} />
		</section>
	);
}
