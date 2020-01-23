import bot from '../settings/app';
import * as keyboard from './keyboards';
import * as usersModel from '../models/usersModel';

require('dotenv').config();

const TELEMAC_ID = process.env.TELEMAC_ID || undefined;

// The bot enters here if the command matches the Regex.
bot.onText(/^\/admision/, async msg => {
	const chatID = msg.chat.id;
	const chatType = msg.chat.type;
	const fromID = msg.from.id;
	const chatFirstname = msg.from.first_name;

	let guard = await usersModel.verifyTelegramID(fromID);

	if (guard) {
		await usersModel.registerTelegramData(msg.from);
	}

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType === 'private') {
		bot.sendMessage(
			chatID,
			`Hola ${chatFirstname}, bienvenido a la admisión del MAC 2020. ¿Ya asististe a la preinscripción para poder formalizar la entrevista y que seas parte de la admisión de este año?`,
			keyboard.preLogin
		);
	}
	// If they try to place the command in the main group (teleMAC) the bot will warn them that it cannot be given that it is only available in private chat.
	else if (chatID == TELEMAC_ID) {
		bot.sendMessage(chatID, `Mira ${fromID}, no quiero hacer spam en este grupo. Así que escribeme en privado.`);
	}
});

bot.on('message', msg => {
	const fromID = msg.from.id;
	const chatType = msg.chat.type;

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType === 'private') {
		if (msg.text.indexOf('💳 Carnet') === 0) {
			bot.sendMessage(
				fromID,
				'Introduce tu número de carnet con el siguiente formato:\n\n_00_*-*_0000_',
				keyboard.replyOpts
			)
				.then(sended => {
					// Escucha la solicitud del carnet.
					bot.onReplyToMessage(sended.chat.id, sended.message_id, async msg => {
						let regex = msg.text.match(/^[0-9]{2}-[0-9]{5}$/g);
						if (regex === null) {
							bot.sendMessage(
								fromID,
								'Introdujiste tu número de carnet mal, asegurate que lo estás escribiendo bien con el formato solicitado.\n\nY vuelve a presionar el botón, no tengo problema en pasar todo el dia aquí en este loop infinito.',
								keyboard.teclado_login
							);
						} else {
							bot.sendMessage(fromID, `Perfecto ${msg.text}`);
							await usersModel.searchCarnet(msg.text);
						}
					});
				})
				.catch(err => {
					bot.sendMessage(fromID, 'Hubo un problema en enviarte algún mensaje.');
					throw new Error('Hubo un problema al momento de presionar el botón de Carnet.', err);
				});
		}

		if (msg.text.indexOf('Sí') === 0) {
			bot.sendMessage(
				fromID,
				`*¡Perfectisísimo!*\n\nAhora solo toca esperar relajadamente hasta el día de la primera reunión que será el miércoles de semana 4 *(29/01/2020)* en hora 7 *(14:00)*.\n\nSi por alguna razón que se te escapa de la manos no puedes asistir, comunícalo lo más pronto posible para considerar tu caso. Te esperamos ansiosamente, ¡No faltes!`,
				{ parse_mode: 'Markdown' }
			);
		}

		if (msg.text.indexOf('¿Ahora qué?') === 0) {
			bot.sendMessage(
				fromID,
				'Sencillo, asistir a la reunión y justo después de que termine dicha reunión yo mismo te escribiré para darte las proximas instrucciones. Para algo soy un bot, ¿No crees?',
				{ parse_mode: 'Markdown' }
			);
		}

		if (msg.text.indexOf('No') === 0) {
			bot.sendMessage(
				fromID,
				`*¡¿Cómo que no?! ¡¿Y qué estás esperando?!*\n\nNo seas tímido y acércate a *MYS-018* para que podamos conocerte a profundidad ( ͡° ͜ʖ ͡°).\n\nRecuerda que si no has sido entrevistado antes del martes de semana 4 *(28/01/2019)* no podrás formalizar tu inscripción en el proceso de admisión.`,
				{ parse_mode: 'Markdown' }
			);
		}
	}
});
