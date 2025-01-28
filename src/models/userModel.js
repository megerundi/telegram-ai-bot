export function createUserModel(user){
    return{
        telegramId: user.id,
        firstName: user.first_name,
        username: user.username,
        messagesHistory: [],
        subscriptionActive: false,
        subscriptionEndDate: null,
        createdAt: new Date()
    }
}