import { generateImage } from "../services/openaiService.js";
import { createUserModel } from '../models/userModel.js';
import {
    getUser,
    addUser, 
    updateTrialPrompts, 
    getSubscriptionStatus
  } from '../services/userService.js';

export default async (ctx) => {
    if (ctx.message?.text?.startsWith('/')) return
    try {
        const telegramId = ctx.from.id;
        const prompt = ctx.message.text;
        const user = await getUser(telegramId);

        //если пользователь не найден 
        if (!user){
            const newUser = createUserModel(ctx.from);

            await addUser(newUser);
        }
        const {isActive, trialPrompts} = await getSubscriptionStatus(telegramId);

        if (!isActive && trialPrompts == 0){
            ctx.reply('У вас осталось 0 пробных запросов. Обновите подписку, чтобы продолжить использовать бота')
            return
        }

        if (!prompt) {
            ctx.reply("Введите описание. Пример: рыжий кот в космосе");
            return
        }
    
        let waitingMessage = await ctx.reply("Это может занять пару секунд...");
        const images = await generateImage(prompt);
        await ctx.deleteMessage(waitingMessage.message_id);
        if (images.length > 0) {
            await ctx.replyWithPhoto(images[0]);
        } else {
            ctx.reply("Не удалось получить изображение :(");
        }

        if (!isActive && trialPrompts > 0) {
            const updatedPrompts = trialPrompts - 1;
            await updateTrialPrompts(telegramId, updatedPrompts);
        }
    } catch (error) {
        console.error("Error generating image:", error);
        ctx.reply("Ошибка при генерации изображения.");
    }
};
  