import {getOpenAIResponse, getHistoryResponse }from '../utils/openai.js';
import db from '../utils/database.js';

export default async (ctx) => {
    try {

        const history = await db.getUserHistory(ctx.from.id);
        history.push({
            role: "user", 
            content: ctx.message.text,
        })

        await ctx.reply('⏳ Подождите, я обрабатываю ваш запрос...');

        const aiResponse = await getHistoryResponse(history);
        history.push({
            role: "assistant",
            content: aiResponse
        })

        await ctx.editMessageText(aiResponse, {
            message_id: parseInt(ctx.message.message_id)+1,
            parse_mode: 'Markdown'
        });
    } catch (error) {
        await ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
        console.log(error);
    }
};