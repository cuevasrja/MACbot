import { PARSE, PRIVATE_CHAT } from '../../constants/botSettings.js';
import bot from '../../settings/app.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();

const ME_ID = process.env.ME_ID || undefined;
const JZ_ID = process.env.JZ_ID || undefined;
const AL_ID = process.env.AL_ID || undefined;
const TELEMAC_ID = process.env.TELEMAC_ID || undefined;
const ADMISION_ID = process.env.ADMISION_ID || undefined;

// ---------------------------------------------------------------------------------------------------- //
// The bot enters here if the command matches the Regex.
// Matches /echo [whatever]
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/echo@admision (.+)/, async (msg, match) => {
	let chatID = msg.chat.id;
	let chatType = msg.chat.type;
	let fromID = msg.from.id;
	let response = match[1];

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType == PRIVATE_CHAT) {
		if (fromID == ME_ID || fromID == AL_ID || fromID == JZ_ID) {
			// Notify the preparer that the message will be sent after 5 seconds.
			bot.sendMessage(
				chatID,
				`El siguiente mensaje será enviado dentro de *5 segundos* al grupo de *Admision MAC 2020*:\n\n${response}`,
				{
					parse_mode: PARSE,
				}
			);

			// The bot waits 5 seconds before continuing with the next command.
			await new Promise(sleep => setTimeout(sleep, 5000));

			// Send the requested message to the chosen group.
			bot.sendMessage(ADMISION_ID, response);
		}
		// If the user does not have permissions, he sends a warning to warn that he cannot send a
		// message to the selected group.
		else {
			bot.sendMessage(
				chatID,
				`Lo siento, pero no tienes permisos para mandar un mensaje para Admision MAC 2020.`,
				{
					parse_mode: PARSE,
				}
			);
		}
	}
});

// ---------------------------------------------------------------------------------------------------- //
// The bot enters here if the command matches the Regex.
// Matches /echo [whatever]
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/echo@telemac (.+)/, async (msg, match) => {
	let chatID = msg.chat.id;
	let chatType = msg.chat.type;
	let fromID = msg.from.id;
	let response = match[1];

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType == PRIVATE_CHAT) {
		if (fromID == ME_ID) {
			// Notify the preparer that the message will be sent after 5 seconds.
			bot.sendMessage(
				chatID,
				`El siguiente mensaje será enviado dentro de *5 segundos* al grupo de *TeleMAC*:\n\n${response}`,
				{
					parse_mode: PARSE,
				}
			);

			// The bot waits 5 seconds before continuing with the next command.
			await new Promise(sleep => setTimeout(sleep, 5000));

			// Send the requested message to the chosen group.
			bot.sendMessage(TELEMAC_ID, response);
		}
		// If the user does not have permissions, he sends a warning to warn that he cannot send a
		// message to the selected group.
		else {
			bot.sendMessage(chatID, `Lo siento, pero no tienes permisos para mandar un mensaje para TeleMAC.`, {
				parse_mode: PARSE,
			});
		}
	}
});
