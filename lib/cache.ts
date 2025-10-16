import { getRedis } from './redis';

const ARRIVALS_CACHE_TTL_SECONDS = 60; // adjust as needed
const ARRIVALS_CACHE_VERSION_KEY = 'arrivals:version';

async function getVersion(): Promise<string> {
	try {
		const redis = getRedis();
		const v = await redis.get(ARRIVALS_CACHE_VERSION_KEY);
		if (v) return v;
		const newV = Date.now().toString(36);
		await redis.set(ARRIVALS_CACHE_VERSION_KEY, newV);
		return newV;
	} catch (error) {
		console.warn('Cache version get error:', error);
		return Date.now().toString(36);
	}
}

export async function bumpArrivalsCacheVersion(): Promise<void> {
	try {
		const redis = getRedis();
		await redis.set(ARRIVALS_CACHE_VERSION_KEY, Date.now().toString(36));
	} catch (error) {
		console.warn('Cache version bump error:', error);
	}
}

export async function getArrivalsCached<T>(keySuffix: string): Promise<T | null> {
	try {
		const redis = getRedis();
		const version = await getVersion();
		const key = `arrivals:${version}:${keySuffix}`;
		const raw = await redis.get(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch (error) {
		console.warn('Cache get error:', error);
		return null;
	}
}

export async function setArrivalsCached<T>(keySuffix: string, value: T): Promise<void> {
	try {
		const redis = getRedis();
		const version = await getVersion();
		const key = `arrivals:${version}:${keySuffix}`;
		await redis.set(key, JSON.stringify(value), 'EX', ARRIVALS_CACHE_TTL_SECONDS);
	} catch (error) {
		console.warn('Cache set error:', error);
	}
}


