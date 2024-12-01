import getOpenAIResponse from '../utils/openai.js';

export default  async (ctx) => {
    try {
        const userMessage = ctx.message.text;
        
        await ctx.reply('⏳ Подождите, я обрабатываю ваш запрос...');
        const aiResponse = await getOpenAIResponse(userMessage);
        await ctx.editMessageText(aiResponse, {
            message_id: parseInt(ctx.message.message_id)+1,
            parse_mode:'Markdown'
        });
    } catch (error) {
        await ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
        console.log(error);
    }
};