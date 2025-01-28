import { Scenes, Markup} from 'telegraf';
import { message } from 'telegraf/filters';
import testCommand from '../commands/test.js';
const adminScene = new Scenes.BaseScene('admin');

adminScene.enter(ctx => ctx.reply('Админ Панель', 
    Markup.keyboard(["/announce", "/exit"]).resize())
)
adminScene.leave(ctx => ctx.reply('Выход', 
    Markup.removeKeyboard())
);
adminScene.command('announce', ctx => {
    ctx.scene.enter('announce');
});
adminScene.command('test', testCommand);

adminScene.command('exit', ctx => {
    ctx.scene.leave()
});

adminScene.on(message('text'), ctx => ctx.reply('Такого я не понимаю ('));

export default adminScene;