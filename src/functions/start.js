import bot from '../settings/app';
import * as usersModel from '../models/usersModel';

require('dotenv').config();

bot.onText(/^\/start/, async msg => {
	const chatID = msg.chat.id;
	const chatType = msg.chat.type;
	const fromID = msg.from.id;

	let guard = await usersModel.verifyTelegramID(fromID);

	if (guard) {
		await usersModel.registerTelegramData(msg.from);
	}

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType === 'private') {
		bot.sendMessage(
			chatID,
			`Bienvenido a mi interfaz, humano. Te doy el permiso de tocar mis botones todo lo que te apetezca.\n\n*Leer a continuación solo si eres pre-nuevo*\n\nEscribe /admision para que vayas al lugar al que perteneces, chamaco.`,
			{ parse_mode: 'Markdown' }
		);
	}
});
