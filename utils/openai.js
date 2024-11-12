const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getOpenAIResponse(prompt){
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "assistant", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        return completion.choices[0].message.content;
    }catch(err){
        console.log(err)
        return;
    }
}

module.exports = {getOpenAIResponse};