import Redis from 'ioredis';

type RedisGlobal = {
	_redis?: Redis;
};

const globalForRedis = globalThis as unknown as RedisGlobal;

export function getRedis(): Redis {
	if (!globalForRedis._redis) {
		const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
		if (!url && process.env.UPSTASH_REDIS_HOST) {
			const host = process.env.UPSTASH_REDIS_HOST;
			const port = process.env.UPSTASH_REDIS_PORT || '6379';
			const password = process.env.UPSTASH_REDIS_PASSWORD;
			globalForRedis._redis = new Redis({
				host,
				port: Number(port),
				password,
				tls: { rejectUnauthorized: false },
			});
		} else if (url) {
			globalForRedis._redis = new Redis(url, {
				tls: url.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
			});
		} else {
			throw new Error('Redis configuration missing');
		}
	}
	return globalForRedis._redis!;
}


