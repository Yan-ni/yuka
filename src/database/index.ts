import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const localURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:27017`;

const uri: string = process.env.MONGO_URI || localURI;

const client = new MongoClient(uri);

async function connectToDatabase(): Promise<void> {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export { client, connectToDatabase };
