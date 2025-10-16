"use client";
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Header() {
    const [open, setOpen] = useState(false);
    return (
        <header className="relative z-10 max-w-5xl mx-auto px-4">
			<motion.div 
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
                className="mt-6 mb-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl px-4 md:px-6 py-4 flex items-center justify-between"
			>
                <div className="flex items-center gap-3">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-lg shadow-black/40"
                    >
                        <Image src="/mylogo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-xl font-bold tracking-tight text-white">
                        {process.env.NEXT_PUBLIC_SITE_NAME || 'When He Arrives'}
                    </h1>
                </div>
                <nav className="hidden sm:flex items-center gap-2">
                    <a href="#add-arrival" className="px-3 md:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">Add Arrival</a>
                    <a href="#weekly" className="px-3 md:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">Weekly Report</a>
                    <a href="#timeline" className="px-3 md:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">Timeline</a>
                </nav>
                <button onClick={() => setOpen(v => !v)} className="sm:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    <Menu className="w-5 h-5" />
                </button>
			</motion.div>
            {open && (
                <div className="sm:hidden mb-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl px-4 py-3 flex flex-col gap-2">
                    <a onClick={() => setOpen(false)} href="#add-arrival" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10">Add Arrival</a>
                    <a onClick={() => setOpen(false)} href="#weekly" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10">Weekly Report</a>
                    <a onClick={() => setOpen(false)} href="#timeline" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10">Timeline</a>
                </div>
            )}
		</header>
	);
}
