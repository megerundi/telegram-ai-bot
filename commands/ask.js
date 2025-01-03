import {getOpenAIResponse, streamChatGPT }from '../utils/openai.js';
import db from '../utils/database.js';

export default async (ctx) => {
    try {
        const prompt = ctx.message.text;
        const userId = ctx.from.id
        const history = await db.getUserHistory(userId);
        history.push({ role: "user", content: prompt})
        const answer = await streamChatGPT(ctx, history);
        history.push({ role: "assistant", content: answer});
        await db.updateUserHistory(userId, history);
    } catch (error) {
        await ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
        console.log(error);
    }
};