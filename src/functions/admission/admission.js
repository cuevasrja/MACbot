import { PRIVATE_CHAT } from '../../constants/botSettings.js';
import { admissionDate } from '../../constants/infoAdmision.js';
import { ALREADY_ASSISTED, BACK, DONT_KNOW, FAQ, LOGIN, NO, YES } from '../../constants/responses.js';
import * as messages from '../../messages/admission.js';
import { verifyTelegramID, registerTelegramData } from '../../models/usersModel.js';
import bot from '../../settings/app.js';
import timezone from '../../settings/timezone.js';
import * as keyboard from '../keyboards.js';
import { sendMessage } from '../sendMessage.js';
import { registerPrenuevo } from '../../models/prenuevosModel.js';

// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
import dotenv from 'dotenv';
dotenv.config();

const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || undefined;

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the command /admision to begin with the guide to the new.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/admision/, async msg => {
	let chatID = msg.chat.id;
	let chatType = msg.chat.type;
	let fromID = msg.from.id;
	let chatFirstName = msg.from.first_name;

	// Guard that is responsible for verifying if the person has already written to the bot before.
	// If so, it does nothing, if it is the first time you write it, it records it in the database.
	let guard = await verifyTelegramID(fromID);

	if (guard) {
		await registerTelegramData(msg.from);
	}

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType === PRIVATE_CHAT) {
		bot.sendMessage(
			chatID,
			`Hola ${chatFirstName}, bienvenido al proceso de admisión del MAC ${admissionDate.year}. ¿Ya sabes que hacer?`,
			keyboard.preLogin
		);
	}
	// If they try to place the command in the main group (teleMAC) the bot will warn them that it cannot be given that it is only available in private chat.
	else {
		bot.sendMessage(chatID, `${chatFirstName}, por grupos não não. Así que escríbeme en privado.`);
	}
});

// El bot escucha los botones que el usuario presiona para enviar el mensaje asociado con ese botón.
bot.on('message', msg => {
	let fromID = msg.from.id;
	let chatType = msg.chat.type;

	// Check if the user writes to the bot in private, this causes the command not to work in groups.
	if (chatType === PRIVATE_CHAT) {
		// If the user presses Log in, the process of data verification begins
		// (which does not verify anything anywhere xD).
		if (msg.text.toString().toLowerCase() === LOGIN.toLowerCase()) {
			// Variables that establish the day of the week and the date corresponding to that day.
			let tz = timezone();
			let day = tz.format('DD');
			let month = tz.format('MM');
			let year = tz.format('YYYY');
			let hour = tz.format('h a');

			// Check if the date is after the day of the first meeting towards the prenuevos.
			if (
				day >= toString(admissionDate.day).padStart(2, '0')
				&& month >= toString(admissionDate.month).padStart(2, '0')
				&& hour >= `${admissionDate.hour} pm`
				&& year >= toString(admissionDate.year)
			) {
				bot.sendMessage(fromID, messages.iniciar_sesion, keyboard.replyOpts)
					.then(sended => {
						// The bot reads the card entered by the person.
						bot.onReplyToMessage(sended.chat.id, sended.message_id, async msg => {
							let carnet = msg.text.match(/^[0-9]{2}-[0-9]{5}$/g);

							// If the card is not written in the indicated format, the bot insults the users.
							if (carnet === null) {
								bot.sendMessage(fromID, messages.fallback_iniciar_session, keyboard.login);
							}
							// If the card is written correctly follow the flow.
							else {
								bot.sendMessage(fromID, messages.carnet_correcto, keyboard.replyOpts).then(sended => {
									// The bot asks for the name of the user.
									bot.onReplyToMessage(sended.chat.id, sended.message_id, async msg => {
										let nombre = msg.text;

										// If the name is not written in the indicated format, the bot insults the users.
										if (nombre === null) {
											bot.sendMessage(fromID, messages.fallback_nombre, keyboard.login);
										}
										// If the name is written correctly follow the flow.
										else {
											bot.sendMessage(fromID, messages.auth_session, keyboard.replyOpts).then(sended => {
												// The bot reads the key entered by the person.
												bot.onReplyToMessage(sended.chat.id, sended.message_id, async msg => {
													let checkPassword = msg.text;

													// If the password is correct, the bot sends the invitation link to the admission group.
													if (checkPassword == LOGIN_PASSWORD) {
														await registerPrenuevo(fromID, nombre, carnet[0]);
														bot.sendMessage(fromID, messages.success, keyboard.inlineURL);
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

							}
						});
					})
					.catch(err => {
						bot.sendMessage(
							fromID,
							'Hubo un problema en enviarte algún mensaje. Por favor contacta con uno de mis creadores: @lmisea o @zambra_shunior.'
						);
						throw new Error('Hubo un problema al momento de presionar el botón de Iniciar sesión.', err);
					});
			}
			// If the person tries to log in before the meeting, the bot tells them to hold on.
			else {
				bot.sendMessage(fromID, messages.holdOn, keyboard.preLogin);
			}
		}

		// Other buttons and their actions (Needless to explain, it's quite intuitive).
		if (msg.text.toString().toLowerCase() === YES.toLowerCase()) {
			bot.sendMessage(fromID, messages.yes_tooLate, keyboard.login);
		}

		if (msg.text.toString().toLowerCase() === NO.toLowerCase()) {
			bot.sendMessage(fromID, messages.too_late, keyboard.preLogin);
		}

		if (msg.text.toString().toLowerCase() === BACK.toLowerCase()) {
			bot.sendMessage(fromID, '... Ok ...\n\nEspero no estés perdido.', keyboard.badLogin);
		}

		if (msg.text.toString().toLowerCase() === DONT_KNOW.toLowerCase()) {
			bot.sendMessage(fromID, messages.idk, keyboard.badLogin);
		}

		// Deprecated.
		if (msg.text.indexOf(ALREADY_ASSISTED) === 0) {
			bot.sendMessage(fromID, messages.ahora_que, keyboard.login);
		}

		if (msg.text.indexOf(FAQ) === 0) {
			let opt = keyboard.preLogin

			const msgs = messages.faq.content.map((message, i) => {
				return [
					{
						text: message.title,
						callback_data: i.toString()
					}
				]

			})

			opt.reply_markup.inline_keyboard = msgs

			bot.sendMessage(fromID, messages.faq.title, opt);

			// We create a listener for the callback query, to check if the invitado has selected an option.
			bot.on("callback_query", async (query) => {
				// We get the chatID of the query.
				const chatID = query.message.chat.id
				// We check if the query is from the invitado we are looking for.
				if (query.from.id != fromID) return
				// We take the answer (Query Data)
				const i = parseInt(query.data)
				const answer = messages.faq.content[i]
				const text = `**${answer.title}** \n\n${answer.content}`
				await sendMessage(chatID, text)
			})
		}
	}
});
