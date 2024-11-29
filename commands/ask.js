const {getOpenAIResponse} = require('../utils/openai')

module.exports =  async (ctx) => {
    try {
        const userMessage = ctx.message.text;
        console.log(userMessage);
        ctx.reply('⏳ Подождите, я обрабатываю ваш запрос...');
        const aiResponse = await getOpenAIResponse(userMessage);
        ctx.reply(aiResponse);
    } catch (error) {
        ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
        console.log(error);
    }
};