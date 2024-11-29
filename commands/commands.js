module.exports = async (ctx) => {
    ctx.reply('/start - to start bot\n/help - to text support', {parse_mode: 'markdown'})
}