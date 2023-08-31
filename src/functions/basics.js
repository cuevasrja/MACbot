import fs from 'fs';
import bot from '../settings/app.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
import { PARSE, PRIVATE_CHAT } from '../constants/botSettings.js';
import { preparerGivesTo, showTeamMembers } from '../notion/readMAS.js';
import { BLOCKS_HOURS, weekDays } from '../constants/notionProps.js';
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
bot.onText(/^\/MAS/, async msg => {
	const chatID = msg.chat.id

	const teamMembers = await showTeamMembers("JC")
	const givesTo = await preparerGivesTo("JC")
	const response = `El equipo de JC está conformado por: ${teamMembers.join(", ")}. Y JC le regala a ${givesTo}`
	bot.sendMessage(chatID, response)
})

const taquillaScheduleMessage = async () => {
	const dateI = new Date();
	const hours = dateI.getHours()
	dateI.setHours(hours - 4);
	const day = dateI.getDay()
	const schedule = await taquillaSchedule()
	// We build the response
	let response = `El horario de taquilla hoy (${weekDays[day - 1]}) es: \n`
	// We iterate over the schedule. First, we take each preparer and their blocks
	for (const [preparer, block] of Object.entries(schedule)) {
		// We iterate over the blocks
		block.forEach((time, index) => {
			// We convert time to a int
			const i = parseInt(time) - 1
			if (index === 0) { // If it's the first block, we add the preparer
				response += `${preparer}: ${BLOCKS_HOURS[i]}\n`
			} else { // If it's not the first block, we add the block with an indentation
				response += `     ${BLOCKS_HOURS[i]}\n`
			}
		})
	}
	response += "Recuerda que si no puedes ir a taquilla, debes avisar con tiempo"
	return response
}

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /taquilla command and sends a message with the schedule of the day.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/taquilla/, async msg => {
	const chatID = msg.chat.id
	const dateI = new Date();
	const hours = dateI.getHours()
	dateI.setHours(hours - 4);
	const day = dateI.getDay()
	// We check if it's a weekend
	if (day === 0 || day === 6) {
		bot.sendMessage(chatID, "No me jodas que es fin de semana, no hay taquilla!!")
		return
	}
	// If it's a weekday, we get the schedule
	const message = await taquillaScheduleMessage()
	bot.sendMessage(chatID, message)
})

const date = new Date();
let hours = date.getHours()
date.setHours(hours - 4);
hours = date.getHours()
// Convertimos las horas, minutos y segundos a milisegundos
const hoursToMilliseconds = hours * 60 * 60 * 1000;
const minutesToMilliseconds = date.getMinutes() * 60 * 1000;
const secondsToMilliseconds = date.getSeconds() * 1000;
// Sumamos los milisegundos
const milliseconds = hoursToMilliseconds + minutesToMilliseconds + secondsToMilliseconds;
// Calculamos los milisegundos que faltan para que sean las 8:00 am
const millisecondsToEight = 8 * 60 * 60 * 1000;
let millisecondsToStart = millisecondsToEight - milliseconds;
// Si el tiempo es negativo, ya son las 8:00 am, por lo que sumamos 24 horas
if (millisecondsToStart < 0) {
	millisecondsToStart += 24 * 60 * 60 * 1000;
}

// TODO: Buscar en BD los IDs de los preparadores y enviarles un mensaje
const sendMessage = () => {
	const dateI = new Date();
	const hours = dateI.getHours()
	dateI.setHours(hours - 4);
	const day = dateI.getDay()
	console.log(day, hours - 4)
	// We check if it's a weekend
	// if (day === 0 || day === 6) {
	// 	bot.sendMessage(chatID, "No me jodas que es fin de semana, no hay taquilla!!")
	// 	return
	// }
	console.log(`Hoy es ${weekDays[day - 1]}`)
	const next24Hours = 24 * 60 * 60 * 1000;
	setInterval(() => {
		sendMessage();
	}, next24Hours);
}

// Ejecutamos la función cada 24 horas
setInterval(() => {
	sendMessage();
}, millisecondsToStart);