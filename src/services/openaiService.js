import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MAX_MSG_SIZE = 3500;
const UPDATE_THRESHOLD = 200;

export async function streamChatGPT(ctx, history) {
    try {
      // Создаём первичное сообщение и сохраняем его ID
      let initialMsg = await ctx.reply('Подождите, формирую ответ...');
      let currentMessageId = initialMsg.message_id;
      let currentMessageText = ''; // что уже в текущем сообщении
      let partialBuffer = '';
      let finalAnswer = '';

      await ctx.sendChatAction('typing');
  
      const response = await openai.chat.completions.create({
        model: process.env.GPT_MODEL, 
        messages: [...history],
        stream: true,
      });
  
      for await (const chunk of response) {
        const textPart = chunk?.choices?.[0]?.delta?.content || '';
        if (!textPart) {
          continue;
        }
  
        finalAnswer += textPart;
        partialBuffer += textPart;

        if (partialBuffer.length >= UPDATE_THRESHOLD) {
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
      return finalAnswer;
  
    } catch (err) {
      console.error('streamChatGPT error:', err);
      await ctx.telegram.sendMessage(process.env.ADMIN_ID, `Произошла ошибка при запросе к ChatGPT: ${err.message}`);
      return '';
    }
}
  
async function editMessageSafe(ctx, messageId, text) {
  if (!text) return
  try {
    await ctx.telegram.editMessageText(ctx.chat.id, messageId, undefined, text);
  } catch (err) {
    if (err?.description?.includes('message is not modified')) {
      return
    }
    console.warn('editMessageSafe error:', err);
    await ctx.reply(text);
  }
}

export async function generateImage(prompt, n = 1, size = "1024x1024") {
  try {
    const response = await openai.images.generate({
      prompt,
      n,
      size,
    });
    // По документации 4.x: `response.data` возвращает массив объектов { url: "..." }
    // Вернём только ссылки
    return response.data.map((img) => img.url);
  } catch (error) {
    console.error("Error in generateImage:", error);
    throw error;
  }
}