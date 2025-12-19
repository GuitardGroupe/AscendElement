import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.BOT_TOKEN;

if (!token) {
    console.error('BOT_TOKEN must be provided!');
    process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
    ctx.reply('Welcome to Ascend! 🚀\n\nClick the button below to start the game.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Play Ascend', web_app: { url: process.env.WEB_APP_URL || 'https://google.com' } }]
            ]
        }
    });
});

bot.launch().then(() => {
    console.log('Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
