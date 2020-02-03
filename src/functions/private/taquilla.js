import bot from '../../settings/app';
import timezone from '../../settings/timezone';
import { googleSpreadsheet } from '../../google/connection';
import { readTaquilla } from '../../google/readTaquilla';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
require('dotenv').config();

const TELEMAC_ID = process.env.TELEMAC_ID || undefined;

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /taquilla  command and sends a message with the box office hours of the day.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/taquilla/, async msg => {
	let chatID = msg.chat.id;
	let firstName = msg.from.first_name;

	// Check if the user writes the command in the TeleMAC group, this makes the command
	// not work in other groups.
	if (chatID == TELEMAC_ID) {
		// Variables that establish the day of the week and the date corresponding to that day.
		let tz = timezone();
		let day = tz.day();
		let days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
		let date = tz.format('DD/MM/YYYY');

		// The bot sends a wait message while making the necessary queries to the API.
		bot.sendMessage(chatID, 'Espera un segundo para obtener la información.').then(async sended => {
			let messageID = sended.message_id;

			// [Important] The data in the API is consulted by passing the method to be used
			// as parameter to the function.
			let data = await googleSpreadsheet(readTaquilla);

			// The bot deletes the wait message you sent previously.
			bot.deleteMessage(chatID, messageID);

			let response = ``;

			// The message is armed with the data received from the Googlesheets API.
			for (let i = 1; i < 6; i++) {
				if (data[0][i] == days[day]) {
					for (let j = 0; j < data.length; j++) {
						if (j == 0) {
							response += `Las personas que cubren taquilla hoy *${days[day]} (${date})* son:\n\n`;
						} else if (j == data.length - 1) {
							response += `Hora ${data[j][0]}: *${data[j][i]}.*`;
						} else {
							response += `Hora ${data[j][0]}: *${data[j][i]}.*\n`;
						}
					}
				}
			}

			// If the query is made on a weekend, a message is sent by fucking the person who requested the schedules.
			if (response.length === 0) {
				response = `Hoy es ${days[day]} hoy no se cubre taquilla. A menos que seas especial, *${firstName}*`;
			}

			// The message is sent with the built message.
			bot.sendMessage(chatID, response, { parse_mode: 'Markdown' });
		});
	}
});
