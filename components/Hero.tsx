"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
	function scrollToId(id: string) {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	return (
		<section className="relative overflow-hidden">
			<div className="max-w-5xl mx-auto px-4 pt-10 pb-6 grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
				<div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
					>
						When He Arrives
					</motion.h1>
					<p className="mt-3 text-white/70 max-w-prose">
						Track and visualize arrivals with a sleek, fast, and modern interface.
					</p>
					<div className="mt-5 flex flex-wrap gap-3">
						<a href="/analytics" className="px-4 h-11 inline-flex items-center rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10">Analytics</a>
						<a href="/api/export" className="px-4 h-11 inline-flex items-center rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10">Export</a>
					</div>
				</div>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="relative rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl shadow-2xl"
				>
					<Image src="/mylogo.png" alt="When He Arrives" width={640} height={480} priority className="w-full h-auto rounded-xl" />
				</motion.div>
			</div>
		</section>
	);
}


