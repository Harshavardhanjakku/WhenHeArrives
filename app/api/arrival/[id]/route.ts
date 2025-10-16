import { arrivalsCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const id = params.id;
		const body = await req.json();
		
		if (!ObjectId.isValid(id)) {
			return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
		}
		
		const ts = body.timestamp ? new Date(body.timestamp) : new Date();
		if (Number.isNaN(ts.getTime())) {
			return NextResponse.json({ success: false, error: 'Invalid timestamp' }, { status: 400 });
		}
		
		const arrivalHour = ts.getHours();
		const timeTag = getTimeTag(arrivalHour);
		const dayOfWeek = getDayOfWeek(ts);
		
		const col = arrivalsCollection();
		const result = await col.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					timestamp: ts,
					note: body.note?.slice(0, 500),
					source: body.source?.slice(0, 50) || 'manual',
					arrivalTime: arrivalHour,
					timeTag: timeTag,
					dayOfWeek: dayOfWeek,
				}
			}
		);
		
		if (result.matchedCount === 0) {
			return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
		}
		
		const updated = await col.findOne({ _id: new ObjectId(id) });
		return NextResponse.json({ success: true, arrival: updated });
	} catch (e: any) {
		return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 });
	}
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const id = params.id;
		console.log('DELETE request for id:', id);
		
		if (!ObjectId.isValid(id)) {
			console.log('Invalid ObjectId:', id);
			return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 });
		}
		
		const col = arrivalsCollection();
		console.log('Attempting to delete document with id:', id);
		
		const result = await col.deleteOne({ _id: new ObjectId(id) });
		console.log('Delete result:', result);
		
		if (result.deletedCount === 0) {
			console.log('No document found with id:', id);
			return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
		}
		
		console.log('Successfully deleted document');
		return NextResponse.json({ success: true });
	} catch (e: any) {
		console.error('Delete error:', e);
		return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 });
	}
}
