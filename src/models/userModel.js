export function createUserModel(user){
    return{
        telegramId: user.id,
        firstName: user.first_name,
        username: user.username,
        messagesHistory: [],
        isSubscribed: false,
        subscriptionEndDate: null,
        trialPrompts: 5,
        createdAt: new Date()
    }
}