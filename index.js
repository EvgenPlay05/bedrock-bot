const bedrock = require('bedrock-protocol');
const { Configuration, OpenAIApi } = require('openai');

// =======================
// Налаштування бота
// =======================
const client = bedrock.createClient({
  host: process.env.MC_HOST,           // IP або домен сервера
  port: Number(process.env.MC_PORT) || 19132,
  username: process.env.MC_NAME || 'ChatGPT',
  offline: true                         // оффлайн-режим
});

// =======================
// Налаштування OpenAI
// =======================
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// =======================
// Події бота
// =======================
client.on('join', () => {
  console.log('✅ ChatGPT підключився до сервера');
});

client.on('disconnect', reason => {
  console.log('❌ ChatGPT відключився:', reason);
});

client.on('error', err => {
  console.error('❌ Bedrock Error:', err);
});

// =======================
// Слухати чат та реагувати
// =======================
client.on('text', async packet => {
  const message = packet.message;
  console.log('CHAT:', message);

  // Перевіряємо команду !gpt
  if (/^!gpt\s+/i.test(message)) {
    const prompt = message.replace(/^!gpt\s+/i, '');
    console.log('Запит до GPT:', prompt);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // GPT-4 замінено на 3.5
        messages: [{ role: "user", content: prompt }]
      });

      const answer = response.choices[0].message.content.trim();

      // Відправляємо відповідь у чат Minecraft
      client.queue('text', { message: `<ChatGPT> ${answer}` });
    } catch (err) {
      console.error('Помилка GPT:', err);
      client.queue('text', { message: '<ChatGPT> Вибач, сталася помилка.' });
    }
  }
});
