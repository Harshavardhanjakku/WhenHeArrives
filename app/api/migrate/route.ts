import { arrivalsCollection } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import type { ArrivalTimeTag, DayOfWeek } from '@/lib/types';

function getTimeTag(hour: number): ArrivalTimeTag {
	if (hour >= 20 && hour < 22) return 'fast'; // 8pm - 10pm
	if (hour >= 22 && hour < 24) return 'late'; // 10pm - 12am
	return 'very_late'; // After 12am (0-7am) or very late night
}

function getDayOfWeek(date: Date): DayOfWeek {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return days[date.getDay()] as DayOfWeek;
}

export async function POST(req: NextRequest) {
	try {
		const col = arrivalsCollection();
		
		// Find all documents that don't have timeTag, arrivalTime, or dayOfWeek
		const docsToUpdate = await col.find({
			$or: [
				{ timeTag: { $exists: false } },
				{ arrivalTime: { $exists: false } },
				{ dayOfWeek: { $exists: false } }
			]
		}).toArray();

		let updatedCount = 0;

		for (const doc of docsToUpdate) {
			const timestamp = new Date(doc.timestamp);
			const arrivalHour = timestamp.getHours();
			const timeTag = getTimeTag(arrivalHour);
			const dayOfWeek = getDayOfWeek(timestamp);

			await col.updateOne(
				{ _id: doc._id },
				{
					$set: {
						arrivalTime: arrivalHour,
						timeTag: timeTag,
						dayOfWeek: dayOfWeek
					}
				}
			);
			updatedCount++;
		}

		return NextResponse.json({ 
			success: true, 
			message: `Updated ${updatedCount} records with time tags`,
			updatedCount 
		}, { status: 200 });

	} catch (e: any) {
		return NextResponse.json({ 
			success: false, 
			error: e?.message || 'Migration failed' 
		}, { status: 500 });
	}
}
