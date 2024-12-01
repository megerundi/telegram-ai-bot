export default (ctx) => {
   if(ctx.from.id != process.env.ADMIN_ID) return;

   ctx.scene.enter('admin')
}