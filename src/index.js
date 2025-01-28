import bot from "./bot.js";
import { connectToDB } from "./config/db.js";
import { logger } from "./utils/logger.js"
import dotenv  from 'dotenv';
dotenv.config();

async function start(){
    try {
        await connectToDB();
        
        bot.launch();
        logger('app', 'Bot is running...');
    } catch {
        logger('error', 'Failed to start bot');
    }
}

start();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))