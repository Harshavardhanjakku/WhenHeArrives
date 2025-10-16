import { arrivalsCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import type { CreateArrivalRequest, ListArrivalsResponse, ArrivalTimeTag, DayOfWeek } from '@/lib/types';

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
		const body = await req.json() as CreateArrivalRequest;
		const ts = body.timestamp ? new Date(body.timestamp) : new Date();
		if (Number.isNaN(ts.getTime())) {
			return NextResponse.json({ success: false, error: 'Invalid timestamp' }, { status: 400 });
		}
		
		const arrivalHour = ts.getHours();
		const timeTag = getTimeTag(arrivalHour);
		const dayOfWeek = getDayOfWeek(ts);
		
		const doc = {
			timestamp: ts,
			note: body.note?.slice(0, 500),
			source: body.source?.slice(0, 50) || (body.timestamp ? 'manual' : 'fast'),
			arrivalTime: arrivalHour,
			timeTag: timeTag,
			dayOfWeek: dayOfWeek,
		};
		const col = arrivalsCollection();
		const result = await col.insertOne(doc);
		const inserted = await col.findOne({ _id: result.insertedId });
		return NextResponse.json({ success: true, arrival: inserted }, { status: 201 });
	} catch (e: any) {
		return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const from = searchParams.get('from');
		const to = searchParams.get('to');
		const limitStr = searchParams.get('limit');
		const timeTag = searchParams.get('timeTag'); // Filter for time tags
		const dayOfWeek = searchParams.get('dayOfWeek'); // Filter for day of week
		
		const query: any = {};
		if (from || to) {
			query.timestamp = {} as any;
			if (from) {
				const d = new Date(from);
				if (Number.isNaN(d.getTime())) return NextResponse.json({ success: false, error: 'Invalid from date' }, { status: 400 });
				query.timestamp.$gte = d;
			}
			if (to) {
				const d = new Date(to);
				if (Number.isNaN(d.getTime())) return NextResponse.json({ success: false, error: 'Invalid to date' }, { status: 400 });
				query.timestamp.$lte = d;
			}
		}
		
		// Add time tag filter
		if (timeTag && ['fast', 'late', 'very_late'].includes(timeTag)) {
			query.timeTag = timeTag;
		}
		
		// Add day of week filter
		if (dayOfWeek && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(dayOfWeek)) {
			query.dayOfWeek = dayOfWeek;
		}
		
		const limit = Math.min(500, Math.max(1, Number(limitStr) || 200));
		const col = arrivalsCollection();
		const docs = await col.find(query).sort({ timestamp: -1 }).limit(limit).toArray();
		const res: ListArrivalsResponse = { success: true, arrivals: docs as any };
		return NextResponse.json(res, { status: 200 });
	} catch (e: any) {
		return NextResponse.json({ success: false, error: e?.message || 'Server error' }, { status: 500 });
	}
}
