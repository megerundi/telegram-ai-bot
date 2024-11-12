const {getOpenAIResponse} = require('../utils/openai')

module.exports =  async (ctx) => {
    try {
        const userMessage = ctx.message.text.replace('/ask', '').trim();

        if (!userMessage) {
            ctx.reply('Пожалуйста, отправьте вопрос сразу после команды /ask.');
            return;
        }
        ctx.reply('⏳ Подождите, я обрабатываю ваш запрос...');

        const aiResponse = await getOpenAIResponse(userMessage);

    
        ctx.reply(aiResponse);
    } catch (error) {
        ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
        console.log(error);
    }
};