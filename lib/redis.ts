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
				connectTimeout: 10000,
				lazyConnect: true,
				maxRetriesPerRequest: 3,
			});
		} else if (url) {
			globalForRedis._redis = new Redis(url, {
				tls: url.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
				connectTimeout: 10000,
				lazyConnect: true,
				maxRetriesPerRequest: 3,
			});
		} else {
			throw new Error('Redis configuration missing');
		}
		
		// Handle connection errors gracefully
		globalForRedis._redis.on('error', (err) => {
			console.warn('Redis connection error:', err.message);
		});
		
		globalForRedis._redis.on('connect', () => {
			console.log('Redis connected successfully');
		});
	}
	return globalForRedis._redis!;
}


