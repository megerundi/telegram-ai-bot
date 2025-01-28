import { getDB } from '../config/db.js';

/**
 * Получить всех пользователей
 */
export async function getUser(telegramId){
    try {
       const db = getDB();
       const user = await db.collection('users').findOne({telegramId});
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
        const logInfo = `New user with telegramId: ${userObj.telegramId} has been added successfully`;
        await db.collection('users').insertOne(userObj);
        logger('app', logInfo);
        console.log(logInfo);
    } catch (error) {
        logger('error', `Error in addUser(${userObj.telegramId}):${error}`);
        console.error(`Error in addUser(${userObj.telegramId}):${error}`);
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

function isSubscriptionActive(user) {
    if (!user || !user.isSubscribed) return false;
    if (!user.subscriptionEndDate) return false;
    return user.subscriptionEndDate > new Date();
  }
  
  /**
   * Проверяем статус подписки и возвращаем, сколько пробных запросов осталось.
   * @param {string|number} telegramId
   * @returns {Object} { isActive: boolean, trialPrompts: number }
   */
export async function getSubscriptionStatus(telegramId) {
    try {
        const db = getDB();
        const user = await db.collection('users').findOne({ telegramId });

        if (!user) {
            return {
                isActive: false,
                trialPrompts: 0
            };
        }

        const subscription = isSubscriptionActive(user);
        const trialLeft = subscription ? 0 : (user.trialPrompts || 0);

        return {
            isActive: subscription,
            trialPrompts: trialLeft
        };
    } catch (error){
        logger('error', `Error in getSubscriptionStatus(${telegramId}): ${error}` )
        console.error(`Error in getSubscriptionStatus(${telegramId}):`, error);
        throw error;
    }
}

export async function updateUserSubscription(telegramId, isSubscribed, subscriptionEndDate) {
    try {
        const db = getDB();
        await db.collection('users').updateOne(
            { telegramId },
            { $set: {
                        isSubscribed,
                        subscriptionEndDate: subscriptionEndDate
                    }
            });
        console.log(`User ${telegramId} UserSubscription was successfully updated`);
        return true;
    } catch (error) {
        logger('error', `Error in updateUserSubscription(${telegramId}): ${error}` )
        console.error(`Error in updateUserSubscription(${telegramId}):`, error);
        throw error;
    }
}

export async function updateTrialPrompts(telegramId, trialPrompts) {
    try {
        const db = getDB();
        await db.collection('users').updateOne(
            { telegramId },
            { $set: {
                        trialPrompts
                    }
            });
        console.log(`User ${telegramId} trialPrompts was successfully updated`);
        return true;
    } catch (error) {
        logger('error', `Error in updateTrialPrompts(${telegramId}): ${error}` )
        console.error(`Error in updateTrialPrompts(${telegramId}):`, error);
        throw error;
    }
}