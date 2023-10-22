import fs from 'fs';
import bot from '../settings/app.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
import { sendMessage } from './sendMessage.js';
import { PARSE, PRIVATE_CHAT } from '../constants/botSettings.js';
// ! SI SE AGREGA UN COMANDO NUEVO, SE TIENE QUE AGREGAR AL ARCHIVO commandsHelp.js
import { COMMANDS, DEV_COMMANDS } from './commandsHelp.js';
import { getAllPreparadores, verifyPreparadorID } from '../models/preparadorModel.js';
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
bot.onText(/^\/hostname/, async msg => {
	const chatID = msg.chat.id;

	// We check if the user is preparador
	if (await verifyPreparadorID(chatID)) {
		bot.sendMessage(chatID, 'No eres preparador, no puedes usar este comando');
		return;
	}

	fs.readFile('/etc/hostname', 'utf8', (err, data) => {
		if (err) throw err;
		bot.sendMessage(chatID, `El servidor donde se está corriendo este bot es en ${data}`);
	});
});

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /help command and sends a message with the commands.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/help/, msg => {
	const chatID = msg.chat.id;
	// ! SI SE AGREGA UN COMANDO NUEVO, SE TIENE QUE AGREGAR AL ARCHIVO commandsHelp.js
	sendMessage(chatID, COMMANDS);
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /dev command and sends a message with the development commands.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/dev/, async msg => {
	const chatID = msg.chat.id;
	// We check if the user is preparador
	if (await verifyPreparadorID(chatID)) {
		bot.sendMessage(chatID, 'No eres preparador, no puedes usar este comando');
		return;
	}
	// We send the message
	sendMessage(chatID, DEV_COMMANDS);
})

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the /preparadores command and sends a message with the list of preparadores.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/preparadores/, async msg => {
	const chatID = msg.chat.id;
	// We check if the user is preparador
	if (await verifyPreparadorID(chatID)) {
		bot.sendMessage(chatID, 'No eres preparador, no puedes usar este comando');
		return;
	}
	// We get all the preparadores
	const preparadores = (await getAllPreparadores())
		.map(preparador => preparador.initials)
		.join(', ');
	// We send the message
	sendMessage(chatID, `Los preparadores son: ${preparadores}`);
})
