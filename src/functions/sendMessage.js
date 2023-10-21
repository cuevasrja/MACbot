import bot from '../settings/app.js';
import { PARSE } from '../constants/botSettings.js';

export const sendMessage = (chatID, message) => {
    bot.sendMessage(chatID, message, { parse_mode: PARSE })
}