import { getUser, addUser } from "../services/userService.js";

export default async (ctx) => {
    try{
        const telegramId = ctx.from.id;
        // let user = await getUser(telegramId);
        
        await ctx.reply(`Добро пожаловать ${ctx.from.first_name || 'человек'} Я твой новый AI помощник`);
        console.log(ctx.from);
        // if(!user){
        //     await addUser(ctx.from);
        //     await ctx.reply(`Добро пожаловать ${ctx.from.first_name} Я твой новый AI помощник!`);
        // } else{
        //     ctx.reply(`C возвращением ${user.first_name}`);
        // }
    } catch(e){ console.log(e) }
}