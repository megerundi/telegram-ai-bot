import {streamChatGPT }from '../services/openaiService.js';
import { createUserModel } from '../models/userModel.js';
import { 
    getUserHistory, 
    updateUserHistory, 
    addUser, 
    updateTrialPrompts, 
    getSubscriptionStatus
  } from '../services/userService.js';

export default async (ctx) => {
    if (ctx.message?.text?.startsWith('/')) return
    try {
        const telegramId = ctx.from.id;
        const prompt = ctx.message.text;
        let history = await getUserHistory(telegramId);

        //Если пользователя нет в бд
        if(!history){
            const newUser = createUserModel(ctx.from);
            await addUser(newUser);
            history = await getUserHistory(telegramId);
        }

        const {isActive, trialPrompts} = await getSubscriptionStatus(telegramId);
        if(!isActive && trialPrompts == 0){
            ctx.reply('У вас осталось 0 пробных запросов. Обновите подписку, чтобы продолжить использовать бота')
            return
        }

        if (!prompt) {
            ctx.reply("Введите описание. Пример: рыжий кот в космосе");
            return
        }

        let context = null;
        if (history.length > 16) {
            context = history.slice(-16);
        } else {
            context = history;
        }
        history.push({ role: "user", content: prompt})
        const answer = await streamChatGPT(ctx, context);
        history.push({ role: "assistant", content: answer});
        await updateUserHistory(telegramId, history);

        if (!isActive && trialPrompts > 0) {
            const updatedPrompts = trialPrompts - 1;
            await updateTrialPrompts(telegramId, updatedPrompts);
        }
    } catch (error) {
        await ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
        console.log(error);
    }
};