import { MongoClient } from "mongodb";

let db = null;
let client = null;

export async function connectToDB(){
    if(db) return db;

    try {
        client = new MongoClient(process.env.DB_URL);
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('Database is successfully connected!');
    } catch (error){
        console.error('Database connecting error: ', error);
        throw error;
    }
}

export function getDB(){
    if (!db) throw new Error('Database is not initialized. Call connectToDB() first.');
    return db;
}

export async function closeDB(){
    if(client){
        await client.close();
        console.log('Database is disconnected');
        db = null;
        client = null;
    }
}