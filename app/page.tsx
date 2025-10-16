import Header from '@/components/Header';
import AddArrival from '@/components/AddArrival';
import Timeline from '@/components/Timeline';
import SummaryCard from '@/components/SummaryCard';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function HomePage() {
	return (
		<div className="relative min-h-screen">
			<AnimatedBackground />
			<div className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">
				<Header />
				<AddArrival />
				<SummaryCard />
				<Timeline />
			</div>
		</div>
	);
}
