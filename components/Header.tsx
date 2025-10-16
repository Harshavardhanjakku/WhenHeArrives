"use client";
import Link from 'next/link';
import { CalendarDays, BarChart3, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
	return (
		<header className="relative z-10 max-w-4xl mx-auto px-4">
			<motion.div 
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
                className="mt-6 mb-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl px-6 py-4 flex items-center justify-between"
			>
				<div className="flex items-center gap-3">
					<motion.div 
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-lg shadow-black/40"
					>
                        <CalendarDays className="w-6 h-6 text-white/80" />
					</motion.div>
					<h1 className="text-xl font-bold tracking-tight text-white">
						{process.env.NEXT_PUBLIC_SITE_NAME || 'When He Arrives'}
					</h1>
				</div>
                <nav className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <a href="#add-arrival" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">Add Arrival</a>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <a href="#weekly" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">Weekly Report</a>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <a href="#timeline" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">Timeline</a>
                    </motion.div>
                </nav>
			</motion.div>
		</header>
	);
}
