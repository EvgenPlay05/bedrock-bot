const bedrock = require('bedrock-protocol');
const OpenAI = require('openai');

// =======================
// Налаштування OpenAI
// =======================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// =======================
// Налаштування бота Minecraft
// =======================
const client = bedrock.createClient({
  host: process.env.MC_HOST,
  port: Number(process.env.MC_PORT) || 19132,
  username: process.env.MC_NAME || 'ChatGPT',
  offline: true
});

// =======================
// Події бота
// =======================
client.on('join', () => {
  console.log('✅ ChatGPT підключився до сервера');
});

client.on('disconnect', reason => {
  console.log('❌ ChatGPT відключився:', reason);
});

// =======================
// Слухати чат та реагувати через GPT
// =======================
client.on('text', async packet => {
  const message = packet.message;
  console.log('CHAT:', message);

  // Якщо повідомлення починається з !gpt
  if (message.match(/^!gpt\s+/i)) {
    const prompt = message.replace(/^!gpt\s+/i, '');
    console.log('Запит до GPT:', prompt);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }]
      });

      const answer = response.choices[0].message.content.trim();

      // Відправляємо відповідь у чат Minecraft
      client.chat(`<ChatGPT> ${answer}`);
    } catch (err) {
      console.error('Помилка GPT:', err);
      client.chat('<ChatGPT> Вибач, сталася помилка при обробці запиту.');
    }
  }
});
