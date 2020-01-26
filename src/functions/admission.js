import bot from '../settings/app';
import timezone from '../settings/timezone';
import * as keyboard from './keyboards';
import * as usersModel from '../models/usersModel';
import * as messages from '../messages/general';

require('dotenv').config();

const TELEMAC_ID = process.env.TELEMAC_ID || undefined;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || undefined;

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
		if (msg.text.indexOf('Iniciar sesión') === 0) {
			let tz = timezone();
			let day = tz.format('DD');
			let month = tz.format('MM');
			let hour = tz.format('h a');

			if (
				(day == '29' && month == '01' && hour >= '6 pm') ||
				parseInt(day) > 29 ||
				(parseInt(month) > 1 && parseInt(day) > 0)
			) {
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
									keyboard.login
								);
							} else {
								bot.sendMessage(
									fromID,
									`Perfecto ${msg.text}, ahora introduce la clave que te dimos en la reunión.`,
									keyboard.replyOpts
								).then(sended => {
									bot.onReplyToMessage(sended.chat.id, sended.message_id, async msg => {
										let checkPassword = msg.text;
										if (checkPassword == LOGIN_PASSWORD) {
											bot.sendMessage(
												fromID,
												`Perfecto, no te equivocaste escribiendo la clave.\n\nPara ingresar al grupo presiona el botón que tienes abajo de este mensaje.`,
												keyboard.inlineURL
											);
										} else {
											bot.sendMessage(
												fromID,
												`Eres un poco lento, te tienes que avispar amigo. Colocaste la contraseña mal.`,
												keyboard.login
											);
										}
									});
								});
							}
						});
					})
					.catch(err => {
						bot.sendMessage(fromID, 'Hubo un problema en enviarte algún mensaje.');
						throw new Error('Hubo un problema al momento de presionar el botón de Iniciar sesión.', err);
					});
			} else {
				bot.sendMessage(
					fromID,
					'Mentiroso, espera a que en la reunión te digan como iniciar sesión.',
					keyboard.preLogin
				);
			}
		}

		if (msg.text.indexOf('Sí') === 0) {
			bot.sendMessage(fromID, messages.yes, keyboard.yes_preLogin);
		}

		if (msg.text.indexOf('Ya asistí a la reunión, ¿Ahora qué?') === 0) {
			bot.sendMessage(fromID, messages.ahora_que, keyboard.login);
		}

		if (msg.text.indexOf('No') === 0) {
			bot.sendMessage(fromID, messages.no, keyboard.preLogin);
		}

		if (msg.text.indexOf('📊 FAQ 📊') === 0) {
			bot.sendMessage(fromID, messages.faq, keyboard.preLogin);
		}
	}
});
