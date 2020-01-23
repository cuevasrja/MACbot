import bot from '../settings/app';
import timezone from '../settings/timezone';
import { googleSpreadsheet } from '../google/connection';
import { readTaquilla } from '../google/readTaquilla';

bot.onText(/^\/taquilla/, async msg => {
	let chatID = msg.chat.id;
	let tz = timezone();
	let day = tz.day();
	let days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	let date = tz.format('DD/MM/YYYY');

	bot.sendMessage(chatID, 'Espera un segundo para obtener la información.').then(async sended => {
		let data = await googleSpreadsheet(readTaquilla);
		bot.deleteMessage(chatID, sended.message_id);

		let response = '';

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

		bot.sendMessage(chatID, response, { parse_mode: 'Markdown' });
	});
});
