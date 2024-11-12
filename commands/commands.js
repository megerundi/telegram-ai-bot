module.exports = async (ctx) => {
    ctx.reply('/start - to start bot\n/help - to text support\n/ask - to ask GPT about smth', {parse_mode: 'markdown'})
}