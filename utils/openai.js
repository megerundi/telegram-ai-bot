import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MAX_MSG_SIZE = 3500;
const UPDATE_THRESHOLD = 200;

export  async function getOpenAIResponse(prompt){
    try{
        const completion = await openai.chat.completions.create({
            model: "o1-mini",
            messages: [
                { role: "assistant", content: "You are a professional AI" },
                { role: "user", content: prompt }
            ],
        });
        return completion.choices[0].message.content;
    }catch(err){
        console.log(err)
        return;
    }
}

export async function streamChatGPT(ctx, history) {
    try {
      // Создаём первичное сообщение и сохраняем его ID
      let initialMsg = await ctx.reply('Подождите, формирую ответ...');
      let currentMessageId = initialMsg.message_id;
      let currentMessageText = ''; // что уже в текущем сообщении
  
      // Буфер, где копим промежуточные порции, прежде чем редактировать
      let partialBuffer = '';
  
      // **Добавили** переменную, чтобы собрать полный ответ 
      let finalAnswer = '';
  
      // Отправляем сигнал "typing" (можно периодически обновлять, если нужно)
      await ctx.sendChatAction('typing');
  
      const response = await openai.chat.completions.create({
        model: 'gpt-o1', 
        messages: [...history],
        stream: true,
      });
  
      // Читаем поток
      for await (const chunk of response) {
        const textPart = chunk?.choices?.[0]?.delta?.content || '';
        if (!textPart) {
          // Иногда приходит role: "assistant" без content
          continue;
        }
  
        // 1) Сохраняем весь ответ (для возврата из функции)
        finalAnswer += textPart;
  
        // 2) Накладываем порцию в буфер (для «куска», который будем отправлять)
        partialBuffer += textPart;
  
        // Проверяем, не достигли ли мы порога 350 символов
        if (partialBuffer.length >= UPDATE_THRESHOLD) {
          // Предполагаем, что сейчас мы хотим добавить partialBuffer к текущему сообщению
          let newMessageText = currentMessageText + partialBuffer;
  
          // Но если это выйдет за лимит в 3500 символов
          if (newMessageText.length > MAX_MSG_SIZE) {
            // 1) Отправляем новое сообщение (начиная с partialBuffer)
            const newMsg = await ctx.reply(partialBuffer);
            // 2) Обновляем "текущий" messageId и текст
            currentMessageId = newMsg.message_id;
            currentMessageText = partialBuffer;
          } else {
            // Если мы вписываемся в лимит — редактируем старое сообщение
            newMessageText = currentMessageText + partialBuffer;
            await editMessageSafe(ctx, currentMessageId, newMessageText);
            currentMessageText = newMessageText;
          }
  
          // Очищаем буфер, так как мы уже «применили» его
          partialBuffer = '';
          // Ещё раз можно отправить сигнал "typing", чтобы индикатор сохранялся
          await ctx.sendChatAction('typing');
        }
      }
  
      // Когда поток завершился, проверяем, не осталось ли что-то в partialBuffer
      if (partialBuffer.length) {
        let newMessageText = currentMessageText + partialBuffer;
        if (newMessageText.length > MAX_MSG_SIZE) {
          // Превышаем лимит — отправляем новое сообщение
          await ctx.reply(partialBuffer);
        } else {
          // Иначе редактируем последний message
          await editMessageSafe(ctx, currentMessageId, newMessageText);
        }
      }
  
      // Когда поток закончился, просто перестаём слать typing — 
      // Telegram уберёт «печатает...» через пару секунд
      // (Можно явно не делать ничего)
  
      // **Важная часть**: Возвращаем полный текст ответа
      return finalAnswer;
  
    } catch (err) {
      console.error('streamChatGPT error:', err);
      await ctx.telegram.sendMessage(process.env.ADMIN_ID, `Произошла ошибка при запросе к ChatGPT: ${err.message}`);
      // Если произошла ошибка, возвращаем пустую строку или 
      // можно выбросить ошибку повторно 
      return '';
    }
  }
  
  /**
   * Безопасное редактирование сообщения.
   */
  async function editMessageSafe(ctx, messageId, text) {
    if (!text) return;
    try {
      await ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined, text);
    } catch (err) {
      if (err?.description?.includes('message is not modified')) {
        // Если контент идентичен предыдущему — игнорируем
        return;
      }
      // Если не смогли отредактировать — просто отправим новое сообщение
      console.warn('editMessageSafe error:', err);
      await ctx.reply(text);
    }
  }