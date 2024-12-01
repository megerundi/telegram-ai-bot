import { Scenes, Markup} from 'telegraf';
import { message } from 'telegraf/filters'
const adminScene = new Scenes.BaseScene('admin');
adminScene.enter(ctx => ctx.reply('Йоу, чё как?', 
    Markup.keyboard(["/announcement", "/exit"]).resize())
)
adminScene.leave(ctx => ctx.reply('Рад служить!', 
    Markup.removeKeyboard())
);
adminScene.command('announcement', ctx => {
    ctx.reply('its work');
    // ctx.scene.enter('newsletter');
});
adminScene.command('exit', ctx => {
    ctx.scene.leave()
    // ctx.scene.enter('newsletter');
});

adminScene.on(message('text'), ctx => ctx.reply('Такого я не понимаю ('));

export default adminScene;