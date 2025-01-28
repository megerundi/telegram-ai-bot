import { getUser, addUser } from '../services/userService.js';
import { createUserModel } from '../models/userModel.js';

export default async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    let user = await getUser(telegramId);

    if (!user) {
      const firstName = ctx.from.first_name || "";
      const userName = ctx.from.username || "";
      
      const newUser = createUserModel(сtx.from);

      await addUser(newUser);

      await ctx.reply(`Добро пожаловать, ${firstName || "друг"}! Я ваш AI-помощник. Вам доступно 5 пробных запроса`);
    } else {
      // Если пользователь уже есть, приветствуем как вернувшегося
      const displayName = user.first_name || user.username || "друг";
      await ctx.reply(`С возвращением, ${displayName}!`);
    }
  } catch (error) {
    console.error("Error in /start command:", error);
    await ctx.reply("Произошла ошибка при выполнении /start. Попробуйте позже.");
  }
}