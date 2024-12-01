import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import db from './utils/database.js';
import dotenv  from 'dotenv';
dotenv.config();

(async () => {
   await db.connect(); 
})();

import startCommand from './commands/start.js';
import askCommand from './commands/ask.js';
import commandsCommand from './commands/commands.js';
import adminCommand from './commands/admin.js';
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN, {parse_mode: 'HTML'});

//HANDLING COMMANDS
bot.start(startCommand);
bot.help(ctx => ctx.reply('Спасение утопающего, дело рук самого утопающего)'));
bot.command('admin', adminCommand);
bot.command('commands', commandsCommand);

//HANDLING GPT PROMPT
bot.on(message('text'), askCommand);
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))