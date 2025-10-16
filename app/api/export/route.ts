import { NextResponse } from 'next/server';
import { arrivalsCollection } from '@/lib/db';
import { toCSV } from '@/lib/utils';

export async function GET() {
	const col = arrivalsCollection();
	const docs = await col.find({}).sort({ timestamp: -1 }).limit(2000).toArray();
	const csv = toCSV(docs as any);
	return new NextResponse(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="arrivals.csv"',
		},
	});
}
