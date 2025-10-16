import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
if (!uri) {
	throw new Error('MONGODB_URI is not set. Add it to your environment.');
}

const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

export function getMongoClient(): MongoClient {
	if (!globalForMongo._mongoClient) {
		globalForMongo._mongoClient = new MongoClient(uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
	}
	return globalForMongo._mongoClient;
}

export function getDb() {
	const client = getMongoClient();
	return client.db('echotime_db');
}

export function arrivalsCollection() {
	return getDb().collection('arrivals');
}
