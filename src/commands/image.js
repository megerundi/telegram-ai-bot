import { generateImage } from "../services/openaiService.js";

export default async (ctx) => {
    // Пример: "/image cat in a space suit"
    const prompt = ctx.message.text;
    if (!prompt) {
        return ctx.reply("Введите описание. Пример: рыжий кот в космосе");
    }
    try {
        let waitingMessage = await ctx.reply("Это может занять пару секунд...");
        const images = await generateImage(prompt);
        await ctx.deleteMessage(waitingMessage.message_id);
        if (images.length > 0) {
            await ctx.replyWithPhoto(images[0]);
        } else {
            ctx.reply("Не удалось получить изображение :(");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        ctx.reply("Ошибка при генерации изображения.");
    }
};
  