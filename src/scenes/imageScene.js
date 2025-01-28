import { Scenes, Markup} from 'telegraf';
import { message } from 'telegraf/filters';
import imageCommand from '../commands/image.js';
import startCommand from '../commands/start.js';
import adminCommand from '../commands/admin.js';

const imageScene = new Scenes.BaseScene('image');

imageScene.enter(ctx => ctx.reply('Введите описание картинки. Пример: рыжий кот в космосе'));

imageScene.start(startCommand);
imageScene.help(ctx => ctx.reply('Здесь должна быть справка'));
imageScene.command('image', ctx => ctx.reply('Введите описание картинки. Пример: рыжий кот в космосе'));
imageScene.command('prompt', ctx => ctx.scene.leave());
imageScene.command('admin', adminCommand);

imageScene.on(message('text'), ctx => {
   //CATCHING NOT EXISTING COMMANDS
   if (ctx.message.text[0] === '/') return

   imageCommand(ctx);
});

export default imageScene;