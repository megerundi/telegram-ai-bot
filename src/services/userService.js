import { getDB } from '../config/db.js';

/**
 * Получить всех пользователей
 */
export async function getUser(telegramId){
    try {
       const db = getDB();
       const user = await db.collection('').findOne({telegramId});
       return user; //или null, если пользователь не найден
    } catch(error) {
        console.error(`Error in getUser(${telegramId}):`, error);
        throw error;
    }
}

/**
 * Получить список всех telegramId
 */
export async function getUsersId() {
    try {
        const db = getDB();
        const documents = await db.collection('users')
            .find({}, { projection: { telegramId: 1, _id: 0 } })
            .toArray();
        return documents.map(doc => doc.telegramId);
    } catch (error) {
        console.error('Error in getUsersId():', error);
        throw error;
    }
}
  
/**
 * Добавить нового пользователя
 * userObj должен иметь структуру, например,
 *  {
 *    telegramId: <number|string>,
 *    chatHistory: []
 *  }
 */
export async function addUser(userObj) {
    try {
        const db = getDB();
        await db.collection('users').insertOne(userObj);
        console.log(`New user with telegramId: ${userObj.telegramId} has been added successfully`);
    } catch (error) {
        console.error(`Error in addUser(${userObj.telegramId}):`, error);
        throw error;
    }
}
  
/**
 * Получить историю чата пользователя
 */
export async function getUserHistory(telegramId) {
    try {
        const db = getDB();
        const user = await db.collection('users').findOne({ telegramId });
        if (!user) {
            return null; // пользователь не найден
        }

        // Если нет поля chatHistory, инициализируем
        if (!('chatHistory' in user)) {
            const newHistory = [
                { role: 'assistant', content: 'You are a helpful AI.' }
            ];
            await db.collection('users').updateOne(
                { telegramId },
                { $set: { chatHistory: newHistory } }
            );
            return newHistory;
        }

        return user.chatHistory; // массив
    } catch (error) {
        console.error(`Error in getUserHistory(${telegramId}):`, error);
        throw error;
    }
}
  
/**
 * Обновить историю чата пользователя
 */
export async function updateUserHistory(telegramId, updatedHistory) {
    try {
        const db = getDB();
        await db.collection('users').updateOne(
            { telegramId },
            { $set: { chatHistory: updatedHistory } }
            );
        console.log(`User ${telegramId} history was successfully updated`);
        return true;
    } catch (error) {
        console.error(`Error in updateUserHistory(${telegramId}):`, error);
        throw error;
    }
}