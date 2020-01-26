import bot from '../settings/app';

require('dotenv').config();

const ADMISION_URL = process.env.ADMISION_URL || undefined;

// Show chat id.
bot.onText(/^\/id/, msg => {
	bot.sendMessage(msg.chat.id, msg.chat.id);
});

bot.onText(/^\/enlace/, msg => {
	let chatType = msg.chat.type;

	if (chatType == 'private') {
		bot.sendMessage(
			msg.chat.id,
			`Para ingresar al grupo que te corresponde para esta admision tienes que presionar el botón de abajo.`,
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
