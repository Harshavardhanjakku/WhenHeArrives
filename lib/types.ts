import type { ObjectId, WithId } from 'mongodb';

export type ArrivalTimeTag = 'fast' | 'late' | 'very_late';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type ArrivalDoc = {
	_id?: ObjectId;
	timestamp: Date;
	note?: string;
	source?: string; // e.g., "doorbell" | "manual"
	arrivalTime?: number; // Hour in 24-hour format (0-23)
	timeTag?: ArrivalTimeTag; // fast, late, very_late
	dayOfWeek?: DayOfWeek; // Monday, Tuesday, etc.
};

export type Arrival = WithId<ArrivalDoc>;

export type CreateArrivalRequest = {
	timestamp?: string; // ISO string
	note?: string;
	source?: string;
};

export type CreateArrivalResponse = {
	success: boolean;
	arrival?: Arrival;
	error?: string;
};

export type ListArrivalsQuery = {
	from?: string;
	to?: string;
	limit?: string;
};

export type ListArrivalsResponse = {
	success: boolean;
	arrivals: Arrival[];
	error?: string;
};

export type DeleteArrivalResponse = {
	success: boolean;
	error?: string;
};
