import fs from 'fs';
import bot from '../settings/app.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();

const ADMISION_URL = process.env.ADMISION_URL || undefined;

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /id command and sends a message with the chat id.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/id/, msg => {
	let chatID = msg.chat.id;

	bot.sendMessage(chatID, chatID);
});

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the command /enlace and sends a message with the link to the admission group.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/enlace/, msg => {
	let chatType = msg.chat.type;
	let chatID = msg.chat.id;

	if (chatType !== 'private') {
		bot.sendMessage(
			chatID,
			`Para ingresar al grupo que te corresponde para esta admisión tienes que presionar el botón de abajo.`,
			{
				parse_mode: 'Markdown',
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'Unirse al grupo',
								url: ADMISION_URL,
							},
						],
					],
				},
			}
		);
	}
});

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /hostname command and sends a message with the hostname of the server.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/hostname/, msg => {
	let chatID = msg.chat.id;

	fs.readFile('/etc/hostname', 'utf8', (err, data) => {
		if (err) throw err;
		bot.sendMessage(chatID, `El servidor donde se está corriendo este bot es en ${data}`);
	});
});
