import { MongoClient } from 'mongodb';
import dotenv  from 'dotenv';
dotenv.config();

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
            console.error('Database connecting error', e);
        }
    }

    async close(){
        try{
            await this.client.close();
            console.log('Database id disconnected');
        }catch(e){
            console.error('Database closing error', e);
        }

    }

    async getUser(telegramId){
        try{
            return await this.users.findOne({id: telegramId})
        }catch(e){
            console.error(`An error occured while getting user: ${telegramId}`, e);
        }
    }

    async addUser(user){
        try{
            await this.users.insertOne(user);
            console.log(`New user: ${user.id} has been added successfully`);
        }catch(e){
            console.error(`An error occured while adding user: ${telegramId}`, e);
        }
    }

    async getUserHistory(telegramId){
        try{
            const user = await this.users.findOne({id: telegramId});
            console.log(user)
            if(user.chatHistory){
                const chatHistory = user.chatHistory;
                return chatHistory;
            } else{
                await this.users.updateOne(
                    {id: telegramId},
                    { $set: { 
                        chatHistory: [] 
                    } }
                )
                return [];
            }
            
        }catch(e){
            console.error(`An error occured while getting user: ${telegramId} prompt history. Error: `, e)
        }
    }

    async updateUserHistory(telegramId, updatedHistory){
        try{
            await this.users.updateOne(
                {
                    id: telegramId
                },
                { $set: {
                    chatHistory: updatedHistory
                }}
            )

            console.log(`User: ${telegramId} history was successfully updated`);
            return true;
        }catch(e){
            console.error(`An error occured while updating user: ${telegramId} prompt history. Error: `, e)
        }
    }
}

export default new Database();