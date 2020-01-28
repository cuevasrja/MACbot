import bot from '../settings/app';
import * as preparadorModel from '../models/preparadorModel';

require('dotenv').config();

const TELEMAC_ID = process.env.TELEMAC_ID || undefined;

bot.on('message', async msg => {
	if (msg.chat.id == TELEMAC_ID) {
		let guard = await preparadorModel.verifyTelegramID(msg.from.id);

		if (guard) {
			await preparadorModel.registerTelegramData(msg.from);
			console.log(`**Telegram ID:${msg.from.id} of ${msg.from.first_name} saved.`);
		}
	}
});
