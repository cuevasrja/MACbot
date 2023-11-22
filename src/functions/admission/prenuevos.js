import * as prenuevosModel from '../../models/prenuevosModel.js';
import bot from '../../settings/app.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();

const ADMISION_ID = process.env.ADMISION_ID || undefined;

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to any message that is written in the main group.
// This is done to save the IDs of all prenuevo. NO MESSAGE SENT IS SAVED.
// ---------------------------------------------------------------------------------------------------- //
bot.on('message', async msg => {
	let chatID = msg.chat.id;

	if (chatID == ADMISION_ID) {
		// Guard that is responsible for verifying if the prenuevo has already written to the group before.
		// If so, it does nothing, if it is the first time you write it, it records it in the database.
		let guard = await prenuevosModel.verifyTelegramID(msg.from.id);

		if (guard) {
			await prenuevosModel.registerTelegramData(msg.from);
			console.log(`**Telegram ID:${msg.from.id} of ${msg.from.first_name} saved.`);
		}
	}
});
