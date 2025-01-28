import { updateUserSubscription} from "../services/userService.js";

export default async (ctx) =>{
    try{
        const telegramId = ctx.from.id;
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 10);
        await updateUserSubscription(telegramId, true, subscriptionEndDate);
        await ctx.reply('Подписка активирована на 10 лет!');
    } catch (error){
        console.log('Ошибка активации подписки', error);
    }
}