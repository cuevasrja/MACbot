import * as preparadorModel from '../../models/preparadorModel.js';
import bot from '../../settings/app.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();

const TELEMAC_ID = process.env.TELEMAC_ID || undefined;

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to any message that is written in the main group.
// This is done to save the IDs of all members. NO MESSAGE SENT IS SAVED.
// ---------------------------------------------------------------------------------------------------- //
bot.on('message', async msg => {
	let chatID = msg.chat.id;

	if (chatID == TELEMAC_ID) {
		// Guard that is responsible for verifying if the member has already written to the group before.
		// If so, it does nothing, if it is the first time you write it, it records it in the database.
		let guard = await preparadorModel.verifyTelegramID(msg.from.id);

		if (guard) {
			await preparadorModel.registerTelegramData(msg.from);
			console.log(`**Telegram ID:${msg.from.id} of ${msg.from.first_name} saved.`);
		}
	}
});
