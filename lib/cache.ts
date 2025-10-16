import { getRedis } from './redis';

const ARRIVALS_CACHE_TTL_SECONDS = 60; // adjust as needed
const ARRIVALS_CACHE_VERSION_KEY = 'arrivals:version';

async function getVersion(): Promise<string> {
	const redis = getRedis();
	const v = await redis.get(ARRIVALS_CACHE_VERSION_KEY);
	if (v) return v;
	const newV = Date.now().toString(36);
	await redis.set(ARRIVALS_CACHE_VERSION_KEY, newV);
	return newV;
}

export async function bumpArrivalsCacheVersion(): Promise<void> {
	const redis = getRedis();
	await redis.set(ARRIVALS_CACHE_VERSION_KEY, Date.now().toString(36));
}

export async function getArrivalsCached<T>(keySuffix: string): Promise<T | null> {
	const redis = getRedis();
	const version = await getVersion();
	const key = `arrivals:${version}:${keySuffix}`;
	const raw = await redis.get(key);
	return raw ? (JSON.parse(raw) as T) : null;
}

export async function setArrivalsCached<T>(keySuffix: string, value: T): Promise<void> {
	const redis = getRedis();
	const version = await getVersion();
	const key = `arrivals:${version}:${keySuffix}`;
	await redis.set(key, JSON.stringify(value), 'EX', ARRIVALS_CACHE_TTL_SECONDS);
}


