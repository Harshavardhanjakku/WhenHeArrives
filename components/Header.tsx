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
						className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
					>
						<CalendarDays className="w-6 h-6 text-cyan-400" />
					</motion.div>
					<h1 className="text-xl font-bold tracking-tight text-white">
						{process.env.NEXT_PUBLIC_SITE_NAME || 'When He Arrives'}
					</h1>
				</div>
				<nav className="flex items-center gap-2">
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<Link 
							href="/analytics" 
							className="group relative px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
						>
							<BarChart3 className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
							<span className="hidden sm:inline">Analytics</span>
							<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
						</Link>
					</motion.div>
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<a 
							href="/api/export" 
							className="group relative px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-purple-400/50 hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-2 text-sm font-medium"
						>
							<Download className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
							<span className="hidden sm:inline">Export</span>
							<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
						</a>
					</motion.div>
				</nav>
			</motion.div>
		</header>
	);
}
