const { Telegraf } = require('telegraf');
const db = require('./utils/database');
require('dotenv').config();

(async () => {
   await db.connect();
})();

const startCommand = require('./commands/start');
const askCommand = require('./commands/ask');
const commandsCommands = require('./commands/commands')
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN, {parse_mode: 'HTML'});


bot.start(startCommand);
bot.help(ctx => ctx.reply('Спасение утопающего, дело рук самого утопающего)'));
// bot.command('ask', askCommand)
bot.on('text', askCommand)
bot.command('commands', commandsCommands)
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))