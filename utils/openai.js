import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export  async function getOpenAIResponse(prompt){
    try{
        const completion = await openai.chat.completions.create({
            model: "o1-mini",
            messages: [
                { role: "assistant", content: "You are a professional AI" },
                { role: "user", content: prompt }
            ],
        });
        return completion.choices[0].message.content;
    }catch(err){
        console.log(err)
        return;
    }
}

export  async function getHistoryResponse(history){
    try{
        const messages = [
            {
                role: "system", 
                content: "based on the chat history, summarize the current message into a standalone message"
            },
            {
                role: "assistant", 
                content: "You are a professional AI",
            }
        ]
        messages.push(...history)
        const completion = await openai.chat.completions.create({
            model: "o1-mini",
            messages,
        });
        return completion.choices[0].message.content;
    }catch(err){
        console.error(`An error occured while getting response from gpt`, err)
        return;
    }
}