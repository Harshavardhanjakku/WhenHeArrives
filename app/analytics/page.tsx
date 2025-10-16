import AnalyticsView from '@/components/AnalyticsView';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
	return (
		<main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
			<h1 className="text-xl font-semibold">Analytics</h1>
			<AnalyticsView />
		</main>
	);
}
