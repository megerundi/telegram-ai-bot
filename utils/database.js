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
            console.log('Database connecting error', e);
        }
    }
    async close(){
        try{
            await this.client.close();
            console.log('Database id disconnected');
        }catch(e){
            console.log('Database closing error', e);
        }

    }
    async getUser(telegramId){
        try{
            return await this.users.findOne({id: telegramId})
        }catch(e){
            console.log(`An error occured while getting user: ${telegramId}`, e);
        }
    }
    async addUser(user){
        try{
            await this.db.collection('users').insertOne(user);
            console.log(`New user: ${user.id} has been added successfully`);
        }catch(e){
            console.log(`An error occured while adding user: ${telegramId}`, e);
        }
    }
}

module.exports = new Database();