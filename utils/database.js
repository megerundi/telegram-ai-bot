const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

class Database {
    constructor(){
        this.client = new MongoClient(process.env.DB_URL);
        this.db = null;
        this.users = null;
    }
    async connect(){
        try{
            await this.client.connect();
            this.db = this.client.db(process.env.DB_NAME);
            this.users = this.db.collection('users');
            console.log('Database is connected successfully!');
        }catch(e){
            console.log('Connecting error', e);
        }
    }
    async close(){
        await this.client.close();
        console.log('Database id disconnected');
    }
    async getUser(telegramId){
        return await this.users.findOne({id: telegramId});
    }
    async addUser(user){
        await this.db.collection('users').insertOne(user);
    }
}

module.exports = new Database();