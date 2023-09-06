import fs from 'fs';
import bot from '../settings/app.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
import { PARSE, PRIVATE_CHAT } from '../constants/botSettings.js';
import { getSuggestions, isParticipantInDB, preparerGivesTo, showTeamMembers } from '../notion/readMAS.js';
import { BLOCKS_HOURS, weekDays } from '../constants/notionProps.js';
import { taquillaSchedule } from '../notion/readTaquilla.js';
import { getAllPreparadores, getPreparadorByTelegramID, verifyPreparadorID } from '../models/preparadorModel.js';
import { getInvitadoByTelegramID, registerInvitado, removeInvitado, searchTelegramID } from '../models/invitadosMASModel.js';
import { startMAS } from '../notion/modifyMAS.js';
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
			`Para ingresar al grupo que te corresponde para esta admisión tienes que presionar el botón de abajo.`,
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

const MASMesssage = async (name) => {
	const teamMembers = await showTeamMembers(name)
	const givesTo = await preparerGivesTo(name)
	let response = `El equipo de ${name} está conformado por: ${teamMembers.join(", ")}. \n`
	response += `${name}, te toca regalarle a: ${givesTo} \n`
	return response
}

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS/, async msg => {
	const chatID = msg.chat.id
	// We check if the user is a preparador or an invitado
	// If the user is not a preparador or an invitado, we send a message and cancel the function
	if (await verifyInvitadoID(chatID)) {
		bot.sendMessage(chatID, "No eres invitado, no puedes usar este comando")
		return
	}
	const name = (await getInvitadoByTelegramID(chatID)).name

	if (await isParticipantInDB(name)) {
		bot.sendMessage(chatID, "No estás registrado en la base de datos de MAS")
		return
	}

	const suggestions = await getSuggestions(name)
	let response = await MASMesssage(name)
	response += `Te recomiendo regalarle: ${suggestions.length === 0 ? "Nada en particular" : suggestions}`
	bot.sendMessage(chatID, response)
})

const teamMessage = async (team, teamName) => {
	team.forEach(async (member) => {
		const memberID = await searchTelegramID(member).telegram_id
		let response = `Bienvenido al equipo ${teamName} de MAS. \n\n`
		response += await MASMesssage(member) + "\n\n"
		response += "Recuerda que para ver esta informacion y la sugerencia de regalo en cualquier momento puedes usar el comando /MAS"
		bot.sendMessage(memberID, response)
	})
}

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS:start command and sends a message with the team members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS:start/, async msg => {
	const chatID = msg.chat.id
	// We check if the user is the jefe
	const jefeChatID = (await getAllPreparadores()).find(preparador => preparador.initials === "JZ").telegram_id
	// If the user is not the jefe, we send a message and cancel the function
	if (chatID !== jefeChatID) {
		bot.sendMessage(chatID, "No me jodas que no eres el jefe!!")
		return
	}
	const { teamA, teamB } = await startMAS()
	console.log("Se ha iniciado el sorteo de MAS")
	teamMessage(teamA, "A")
	teamMessage(teamB, "B")
	console.log("Se ha enviado el mensaje a los equipos")
})

let isMASActive = false

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS:switch command and switches the MAS state.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS:switch/, async msg => {
	const chatID = msg.chat.id
	// We check if the user is the jefe
	const jefeChatID = (await getAllPreparadores()).find(preparador => preparador.initials === "JZ").telegram_id
	// If the user is not the jefe, we send a message and cancel the function
	if (chatID !== jefeChatID) {
		bot.sendMessage(chatID, "No me jodas que no eres el jefe!!")
		return
	}
	isMASActive = !isMASActive
	const message = isMASActive ? "MAS activo" : "MAS inactivo"
	bot.sendMessage(chatID, message)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS:add [name] command and adds a new member to the list of members of MAS.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS:add (.+)/, async (msg, match) => {
	const chatID = msg.chat.id
	// We check if MAS registration is active
	if (!isMASActive) {
		bot.sendMessage(chatID, "El registro de MAS está inactivo")
		return
	}
	// We take the name of the new member
	const name = match.slice(1).join(" ")
	// We register the new member in the database
	registerInvitado({ telegram_id: chatID, name })
	bot.sendMessage(chatID, `Se ha registrado a ${name} como miembro de MAS`)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /MAS:remove command and removes a member from the list of members of MAS with the telegram id.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/MAS:remove/, async msg => {
	const chatID = msg.chat.id
	// We check if MAS registration is active
	if (!isMASActive) {
		bot.sendMessage(chatID, "El registro de MAS está inactivo")
		return
	}
	// We get the name of the member
	const name = (await getInvitadoByTelegramID(chatID)).name
	// We remove the member from the database
	removeInvitado(chatID)
	bot.sendMessage(chatID, `Se ha eliminado a ${name} de la lista de miembros de MAS`)
	console.log(`Se ha eliminado a ${name} de la lista de miembros de MAS`)
})

const taquillaScheduleMessage = async () => {
	const dateI = new Date();
	const hours = dateI.getHours()
	dateI.setHours(hours - 4);
	const day = dateI.getDay()
	// We get the schedule of the day
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

// isTaquillaActive is a boolean that indicates if the taquilla is active or not
let isTaquillaActive = true

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /taquilla:switch command and switches the taquilla state.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/taquilla:switch/, async msg => {
	const chatID = msg.chat.id
	// We check if the user is the jefe
	const jefeChatID = (await getAllPreparadores()).find(preparador => preparador.initials === "JZ").telegram_id
	// If the user is not the jefe, we send a message and cancel the function
	if (chatID !== jefeChatID) {
		bot.sendMessage(chatID, "No me jodas que no eres el jefe!!")
		return
	}
	isTaquillaActive = !isTaquillaActive
	const message = isTaquillaActive ? "Taquilla abierta" : "Taquilla cerrada"
	bot.sendMessage(chatID, message)
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /taquilla command and sends a message with the schedule of the day.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/taquilla/, async msg => {
	const chatID = msg.chat.id
	// We check if the user is a preparador
	// If the user is not a preparador, we send a message and cancel the function
	if (await verifyPreparadorID(chatID)) {
		bot.sendMessage(chatID, "No eres preparador!!")
		return
	}
	// We get the initials of the preparer
	const preparer = (await getPreparadorByTelegramID(chatID)).initials
	const dateI = new Date();
	const hours = dateI.getHours()
	dateI.setHours(hours - 4);
	const day = dateI.getDay()
	// We check if it's a weekend
	if (day === 0 || day === 6) {
		bot.sendMessage(chatID, `No me jodas ${preparer} que es fin de semana, no hay taquilla!!`)
		return
	}
	// We check if the taquilla is active
	if (!isTaquillaActive) {
		bot.sendMessage(chatID, `Deja de joder ${preparer}, la taquilla está cerrada`)
		return
	}
	// If it's a weekday and the taquilla is active, we send the message
	const message = await taquillaScheduleMessage()
	bot.sendMessage(chatID, message)
})

/**
 * sendMessage()
 * This function sends a message to each preparer with their schedule of the day.
 */
const sendMessage = async () => {
	const dateI = new Date();
	const hours = dateI.getHours()
	dateI.setHours(hours - 4);
	const day = dateI.getDay()
	console.log(day, hours - 4)
	// We check if the taquilla is active
	if (isTaquillaActive) {
		// We check if it's a weekend. 0 is Sunday and 6 is Saturday
		if (day === 0 || day === 6) {
			return
		}
		console.log(`Hoy es ${weekDays[day - 1]}`)
		// If it's a weekday, we get the schedule of the day
		const schedule = await taquillaScshedule()
		// We get the IDs of the preparers of the day
		const preparers = (await getAllPreparadores())
			.map(preparer => [preparer.telegram_id, preparer.initials])
			.filter(preparer => Object.keys(schedule).includes(preparer[1]))
		// We send the message to each preparer
		preparers.forEach(preparer => {
			// We build the message
			let msg = `Hola ${preparer[1]}, recuerda que hoy ${weekDays[day - 1]} tienes taquilla. Tu horario es: \n`
			// We iterate over the blocks
			schedule[preparer[1]].forEach(time => {
				const i = parseInt(time) - 1
				msg += `     ${BLOCKS_HOURS[i]}\n`
			})
			// We add the last message
			msg += "Recuerda que si no puedes ir a taquilla, debes avisar con tiempo"
			bot.sendMessage(preparer[0], msg)
		})
	}
	// We calculate the milliseconds to the next day
	const next24Hours = 24 * 60 * 60 * 1000;
	// We send the message every 24 hours
	setInterval(() => {
		sendMessage();
	}, next24Hours);
}

const date = new Date();
let hours = date.getHours()
date.setHours(hours - 4);
hours = date.getHours()
// Convert to milliseconds
const hoursToMilliseconds = hours * 60 * 60 * 1000;
const minutesToMilliseconds = date.getMinutes() * 60 * 1000;
const secondsToMilliseconds = date.getSeconds() * 1000;
// Sum all the milliseconds
const milliseconds = hoursToMilliseconds + minutesToMilliseconds + secondsToMilliseconds;
// Calculate the milliseconds to 8:00 am
const millisecondsToEight = 8 * 60 * 60 * 1000;
let millisecondsToStart = millisecondsToEight - milliseconds;
// If the milliseconds to start is negative, we add 24 hours
if (millisecondsToStart < 0) {
	millisecondsToStart += 24 * 60 * 60 * 1000;
}

// Every day at 8:00 am, we send the message
setInterval(() => {
	sendMessage();
}, millisecondsToStart);