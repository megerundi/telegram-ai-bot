import {streamChatGPT }from '../services/openaiService.js';
import { getUserHistory, updateUserHistory } from '../services/userService.js';
export default async (ctx) => {
    try {
        const prompt = ctx.message.text;
        const userId = ctx.from.id
        const history = await getUserHistory(userId);
        let context = null;
        if (history.length > 16) {
            context = history.slice[-16];
        } else {
            context = history;
        }
        history.push({ role: "user", content: prompt})
        const answer = await streamChatGPT(ctx, context);
        history.push({ role: "assistant", content: answer});
        await updateUserHistory(userId, history);
    } catch (error) {
        await ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
        console.log(error);
    }
};