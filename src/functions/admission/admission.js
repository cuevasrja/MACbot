import bot from '../../settings/app';
import timezone from '../../settings/timezone';
import * as keyboard from '../keyboards';
import * as usersModel from '../../models/usersModel';
import * as messages from '../../messages/admission';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
require('dotenv').config();

const TELEMAC_ID = process.env.TELEMAC_ID || undefined;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || undefined;

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the command /admision to begin with the guide to the new.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/admision/, async msg => {
	let chatID = msg.chat.id;
	let chatType = msg.chat.type;
	let fromID = msg.from.id;
	let chatFirstname = msg.from.first_name;

	// Guard that is responsible for verifying if the person has already written to the bot before.
	// If so, it does nothing, if it is the first time you write it, it records it in the database.
	let guard = await usersModel.verifyTelegramID(fromID);

	if (guard) {
		await usersModel.registerTelegramData(msg.from);
	}

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType === 'private') {
		bot.sendMessage(
			chatID,
			`Hola ${chatFirstname}, bienvenido al proceso de admisión del MAC 2020. ¿Ya sabes que hacer?`,
			keyboard.preLogin
		);
	}
	// If they try to place the command in the main group (teleMAC) the bot will warn them that it cannot be given that it is only available in private chat.
	else if (chatID == TELEMAC_ID) {
		bot.sendMessage(chatID, `Mira ${fromID}, no quiero hacer spam en este grupo. Así que escribeme en privado.`);
	}
});

// El bot escucha los botones que el usuario presiona para enviar el mensaje asociado con ese botón.
bot.on('message', msg => {
	let fromID = msg.from.id;
	let chatType = msg.chat.type;

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType === 'private') {
		// If the user presses Log in, the process of data verification begins
		// (which does not verify anything anywhere xD).
		if (msg.text.indexOf('Iniciar sesión') === 0) {
			// Variables that establish the day of the week and the date corresponding to that day.
			let tz = timezone();
			let day = tz.format('DD');
			let month = tz.format('MM');
			let hour = tz.format('h a');

			// Check if the date is after the day of the first meeting towards the prenuevos.
			if (
				(day == '29' && month == '01' && hour >= '6 pm') ||
				parseInt(day) > 29 ||
				(parseInt(month) > 1 && parseInt(day) > 0)
			) {
				bot.sendMessage(fromID, messages.iniciar_sesion, keyboard.replyOpts)
					.then(sended => {
						// The bot reads the card entered by the person.
						bot.onReplyToMessage(sended.chat.id, sended.message_id, async msg => {
							let regex = msg.text.match(/^[0-9]{2}-[0-9]{5}$/g);

							// If the card is not written in the indicated format, the bot insults the users.
							if (regex === null) {
								bot.sendMessage(fromID, messages.fallback_iniciar_session, keyboard.login);
							}
							// If the card is written correctly follow the flow.
							else {
								bot.sendMessage(fromID, messages.auth_session, keyboard.replyOpts).then(sended => {
									// The bot reads the key entered by the person.
									bot.onReplyToMessage(sended.chat.id, sended.message_id, async msg => {
										let checkPassword = msg.text;

										// If the password is correct, the bot sends the invitation link to the admission group.
										if (checkPassword == LOGIN_PASSWORD) {
											bot.sendMessage(fromID, messages.sucess, keyboard.inlineURL);
										}
										// If this is incorrect, it tells you that it is stupid.
										else {
											bot.sendMessage(fromID, messages.fallback_auth_session, keyboard.login);
										}
									});
								});
							}
						});
					})
					.catch(err => {
						bot.sendMessage(
							fromID,
							'Hubo un problema en enviarte algún mensaje. Por favor contacta con mi creador @MaEscalanteHe.'
						);
						throw new Error('Hubo un problema al momento de presionar el botón de Iniciar sesión.', err);
					});
			}
			// If the person tries to log in before the meeting, the bot tells him that he is a liar.
			else {
				bot.sendMessage(fromID, messages.liar, keyboard.preLogin);
			}
		}

		// Other buttons and their actions (Needless to explain, it's quite intuitive).
		if (msg.text.toString().toLowerCase() === 'sí') {
			bot.sendMessage(fromID, messages.yes_tooLate, keyboard.login);
		}

		if (msg.text.toString().toLowerCase() === 'no') {
			bot.sendMessage(fromID, messages.too_late, keyboard.preLogin);
		}

		if (msg.text.toString().toLowerCase() === 'atrás') {
			bot.sendMessage(fromID, '... Ok ...\n\nEspero no estés perdido.', keyboard.stupidLogin);
		}

		if (msg.text.toString().toLowerCase() === 'no sé que hacer') {
			bot.sendMessage(fromID, messages.idk, keyboard.stupidLogin);
		}

		// Deprecated.
		if (msg.text.indexOf('Ya asistí a la reunión, ¿Ahora qué?') === 0) {
			bot.sendMessage(fromID, messages.ahora_que, keyboard.login);
		}

		if (msg.text.indexOf('📊 FAQ 📊') === 0) {
			bot.sendMessage(fromID, messages.faq, keyboard.preLogin);
		}
	}
});
