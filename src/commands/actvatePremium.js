import { getUser, updateUserSubscription} from "../services/userService";

export default async (ctx) =>{
    const telegramId = ctx.from.id;
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 10);

    await updateUserSubscription(telegramId, true, subscriptionEndDate);
}