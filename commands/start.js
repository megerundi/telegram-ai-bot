import db from '../utils/database.js';

export default async (ctx) => {
    try{
        const telegramId = ctx.from.id;
        let user = await db.getUser(telegramId);
        
        if(!user){
            await db.addUser(ctx.from);
            await ctx.reply(`Добро пожаловать ${ctx.from.first_name || 'человек'} Я твой новый AI помощник. Увидеть полный список команд - /commands`);
        } else{
            ctx.reply(`C возвращением ${user.first_name}`);
        }
    } catch(e){ console.log(e) }
}