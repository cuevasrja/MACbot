import fs from 'fs';
import bot from '../settings/app.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
import { PARSE, PRIVATE_CHAT } from '../constants/botSettings.js';
import { preparerGivesTo, showTeamMembers } from '../notion/readMAS.js';
import { BLOCKS_HOURS } from '../constants/notionProps.js';
import { taquillaSchedule } from '../notion/readTaquilla.js';
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

	if (chatType !== PRIVATE_CHAT) {
		bot.sendMessage(
			chatID,
			`Para ingresar al grupo que te corresponde para esta admision tienes que presionar el botón de abajo.`,
			{
				parse_mode: PARSE,
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

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS/, msg => {
	const chatID = msg.chat.id

	const teamMembers = showTeamMembers("JC")
	const givesTo = preparerGivesTo("JC")
	const response = `El equipo de JC está conformado por: ${teamMembers.join(", ")}. Y JC le regala a ${givesTo}`
	bot.sendMessage(chatID, response)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /taquilla command and sends a message with the schedule of the day.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/taquilla/, msg => {
	const chatID = msg.chat.id
	const day = new Date().getDay()
	// We check if it's a weekend
	if (day === 0 || day === 6) {
		bot.sendMessage(chatID, "__**No me jodas que es fin de semana, no hay taquilla!!**__")
		return
	}
	// If it's a weekday, we get the schedule
	const schedule = taquillaSchedule()
	// We build the response
	let response = "El horario de taquilla hoy es: \n"
	// We iterate over the schedule. First, we take each preparer and their blocks
	for (const [preparer, block] of Object.entries(schedule)) {
		// We iterate over the blocks
		block.forEach((time, index) => {
			// We convert time to a int
			const i = parseInt(time) - 1
			if (index === 0) { // If it's the first block, we add the preparer
				response += `**${preparer}:** ${BLOCKS_HOURS[i]}\n`
			} else { // If it's not the first block, we add the block with an indentation
				response += `     ${BLOCKS_HOURS[i]}\n`
			}
		})
	}
	response += "__Recuerda que si no puedes ir a taquilla, debes avisar con tiempo__"
	bot.sendMessage(chatID, response)
})