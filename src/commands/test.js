import { getUserHistory } from "../services/userService.js";

export default async (ctx) => {
    try{
        const userHistory = await getUserHistory(ctx.from.id);
        console.log(`User HISTORY: ${userHistory}`);
    }catch(e){
        console.error('Error while testing!', e)
    }
}