import bot from '../settings/app';
import fs from 'fs';

require('dotenv').config();

const TELEMAC_ID = process.env.TELEMAC_ID || undefined;
const ADMISION_ID = process.env.ADMISION_ID || undefined;

bot.onText(/^\/hostname/, msg => {
	let chatType = msg.chat.type;
	let chatID = msg.chat.id;

	if (chatType == 'private' || chatID == TELEMAC_ID || chatID == ADMISION_ID) {
		fs.readFile('/etc/hostname', 'utf8', (err, data) => {
			if (err) throw err;
			bot.sendMessage(msg.chat.id, `El servidor donde se está corriendo este bot es en ${data}`);
		});
	}
});
