import { Scenes, session, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters'; 

import startCommand from './commands/start.js';
import askCommand from './commands/prompt.js';
import adminCommand from './commands/admin.js';

import adminScene from './scenes/adminScene.js';
import announceScene from './scenes/announceScene.js'
import imageScene from './scenes/imageScene.js';

//INIT BOT AND BOT SCENES
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN, {parse_mode: 'HTML'});
const stage = new Scenes.Stage([adminScene, announceScene, imageScene]);

bot.use(session());
bot.use(stage.middleware());
bot.setMyCommands([
   { command: "start", description: "Запустить бота" },
   { command: "help", description: "Получить справку по боту" },
   { command: "prompt", description: "Включить режим генерации текста" },
   { command: "image", description: "Включить режим генерации картинок" },
 ]);

//HANDLING COMMANDS
bot.start(startCommand);
bot.help(ctx => ctx.reply('Здесь должна быть справка'));
bot.command('admin', adminCommand);
bot.command('prompt', ctx => ctx.reply('Напишите ваш запрос'));
bot.command('image', ctx => ctx.scene.enter('image'));

bot.generate

//HANDLING GPT PROMPT
bot.on(message('text'), ctx => {
   //CATCHING NOT EXISTING COMMANDS
   if (ctx.message.text[0] === '/') return;

   askCommand(ctx);
})

export default bot;