import { createBot } from "bedrock-protocol";
import OpenAssistant from "open-assistant";

// =====================
// Змінні середовища
// =====================
const BOT_NAME = process.env.BOT_NAME || "CraftyBot";
const BOT_COMMAND = process.env.BOT_COMMAND || "!ai";
const BOT_GREETING = process.env.BOT_GREETING || "Привіт! Я бот AI!";
const SERVER_HOST = process.env.SERVER_HOST || "localhost";
const SERVER_PORT = parseInt(process.env.SERVER_PORT) || 19132;
const BOT_USERNAME = process.env.BOT_USERNAME || BOT_NAME;

// =====================
// Створюємо Minecraft Bot
// =====================
const bot = createBot({
  host: SERVER_HOST,
  port: SERVER_PORT,
  username: BOT_USERNAME,
});

// =====================
// Налаштовуємо Open Assistant
// =====================
const assistant = new OpenAssistant();

// =====================
// Привітання при вході
// =====================
bot.on("spawn", () => {
  bot.chat(BOT_GREETING);
  console.log(`${BOT_NAME} підключився до сервера ${SERVER_HOST}:${SERVER_PORT}`);
});

// =====================
// Обробка повідомлень
// =====================
bot.on("message", async (message) => {
  const msgText = message.toString().trim();

  // Перевіряємо чи починається повідомлення з команди бота
  if (msgText.toLowerCase().startsWith(BOT_COMMAND.toLowerCase())) {
    const prompt = msgText.slice(BOT_COMMAND.length).trim();
    if (!prompt) {
      bot.chat("Будь ласка, введи питання після команди!");
      return;
    }

    bot.chat("Думаю...");
    console.log(`Запит від гравця: ${prompt}`);

    try {
      // Отримуємо відповідь від Open Assistant
      const response = await assistant.ask(prompt);
      bot.chat(response.text);
      console.log(`Відповідь бота: ${response.text}`);
    } catch (err) {
      bot.chat("Вибач, щось пішло не так 🤖");
      console.error("Помилка Open Assistant:", err);
    }
  }
});
