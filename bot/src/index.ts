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
    //const welcomeImage = 'https://ton-site.com/splash-screen.jpg'; // Image 16:9 recommandée
    /*
ctx.replyWithPhoto(welcomeImage, {
        caption: `✨ *Ascend Element - V0.0.1*\n\nBienvenue voyageur ! Es-tu prêt à conquérir les éléments ?`,
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🕹️ Démarrer l\'Aventure', web_app: { url: process.env.WEB_APP_URL || '' } }],
                [{ text: '📢 Canal Officiel', url: 'https://t.me/...' }, { text: '🏆 Classement', callback_data: 'leaderboard' }]
            ]
        }
    });
    */

    ctx.reply('Ascend Element - V0.0.1', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Jouer', web_app: { url: process.env.WEB_APP_URL || 'https://google.com' } }]
            ]
        }
    });
});

bot.telegram.setChatMenuButton({
    menuButton: {
        type: 'web_app',
        text: 'Lancer le Jeu 🚀',
        web_app: { url: process.env.WEB_APP_URL || '' }
    }
});

bot.on('inline_query', async (ctx) => {
    const result = [{
        type: 'article',
        id: '1',
        title: 'Jouer à Ascend Element',
        description: 'Rejoins-moi pour une partie !',
        thumb_url: 'Lien_vers_ton_logo.png',
        input_message_content: {
            message_text: "Je t'invite à jouer à Ascend Element !"
        },
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Accepter l\'invitation 🎮', web_app: { url: process.env.WEB_APP_URL || '' } }]
            ]
        }
    }];
    return await ctx.answerInlineQuery(result as any);
});

bot.launch().then(() => {
    console.log('Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
