import { Scenes, Markup} from 'telegraf';
import { message } from 'telegraf/filters';
import db from '../utils/database.js';

const announceScene = new Scenes.BaseScene('announce');

announceScene.enter(ctx => ctx.reply('Введите текст рассылки', 
    Markup.keyboard(["Назад",]).resize())
)

announceScene.leave(ctx => {
    ctx.reply('Возвращаемся в Админку',  Markup.removeKeyboard());
    ctx.scene.enter('admin');
});

announceScene.on(message('text'), async ctx =>{
    try{
        const announceText = ctx.message.text;
        if(announceText == 'Назад') ctx.scene.leave();

        const users = db.getUsersId();
        
        users.forEach( user => ctx.telegram.sendMessage(user, announceText));
        ctx.reply(':)', Markup.removeKeyboard());
    } catch(e){
        ctx.reply(`Возникла ошибка: ${e}`, Markup.removeKeyboard());
    }
    
})

export default announceScene;