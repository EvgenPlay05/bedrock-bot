
// index.js
const { Configuration, OpenAIApi } = require("openai");

// Ініціалізація OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // переконайся, що ключ у змінних середовища
});
const openai = new OpenAIApi(configuration);

// Приклад використання OpenAI
async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Привіт, перевір мене!" }
      ],
    });
    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
  }
}

testOpenAI();
