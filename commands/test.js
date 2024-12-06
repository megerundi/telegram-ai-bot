import db from '../utils/database.js'

export default async (ctx) => {
    try{
        const userHistory = await db.getUserHistory(ctx.from.id);
        console.log(`User HISTORY: ${userHistory}`);
    }catch(e){
        console.error('Error while testing!', e)
    }
}