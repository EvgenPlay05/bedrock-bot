const bedrock = require('bedrock-protocol')
const { Configuration, OpenAIApi } = require('openai')

// =======================
// Налаштування бота
// =======================
const client = bedrock.createClient({
  host: process.env.MC_HOST,
  port: Number(process.env.MC_PORT) || 19132,
  username: process.env.MC_NAME || 'ChatGPT',
  offline: true
})

// =======================
// Налаштування OpenAI
// =======================
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

// =======================
// Події бота
// =======================
client.on('join', () => {
  console.log('✅ ChatGPT підключився до сервера')
})

client.on('disconnect', reason => {
  console.log('❌ ChatGPT відключився:', reason)
})

// =======================
// Слухати чат та реагувати
// =======================
client.on('text', async packet => {
  const message = packet.message
  console.log('CHAT:', message)

  // Перевіряємо, чи починається з !GPT або !gpt + відступ
  if (message.match(/^!gpt\s+/i)) {
    const prompt = message.replace(/^!gpt\s+/i, '')
    console.log('Запит до GPT:', prompt)

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }]
      })

      const answer = response.data.choices[0].message.content.trim()

      // Відправляємо відповідь у чат Minecraft
      client.chat(`<ChatGPT> ${answer}`)
    } catch (err) {
      console.error('Помилка GPT:', err)
      client.chat('<ChatGPT> Вибач, сталася помилка при обробці запиту.')
    }
  }
})
