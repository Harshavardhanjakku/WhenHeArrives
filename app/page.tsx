import Header from '@/components/Header';
import AddArrival from '@/components/AddArrival';
import Timeline from '@/components/Timeline';
import SummaryCard from '@/components/SummaryCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import Hero from '@/components/Hero';

export default function HomePage() {
	return (
		<div className="relative min-h-screen">
			<AnimatedBackground />
			<div className="relative z-10 max-w-5xl mx-auto px-4 py-6 space-y-8">
				<Header />
				<Hero />
				<section id="add-arrival"><AddArrival /></section>
				<section id="weekly"><SummaryCard /></section>
				<section id="timeline"><Timeline /></section>
			</div>
		</div>
	);
}
