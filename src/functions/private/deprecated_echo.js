// ---------------------------------------------------------------------------------------------------- //
//																										//
//																										//
// 										Deprecated for errors.											//
// 																										//
//																										//
// ---------------------------------------------------------------------------------------------------- //

// import bot from '../../settings/app';

// // ---------------------------------------------------------------------------------------------------- //
// // Environment variables.
// // ---------------------------------------------------------------------------------------------------- //
// require('dotenv').config();

// const ME_ID = process.env.ME_ID || undefined;
// const JZ_ID = process.env.JZ_ID || undefined;
// const TELEMAC_ID = process.env.TELEMAC_ID || undefined;
// const ADMISION_ID = process.env.ADMISION_ID || undefined;

// // ---------------------------------------------------------------------------------------------------- //
// // The bot enters here if the command matches the Regex.
// // Matches /echo [whatever]
// // ---------------------------------------------------------------------------------------------------- //
// bot.onText(/^\/echo (.+)/, (msg, match) => {
// 	let messageID = msg.message_id;
// 	let chatID = msg.chat.id;
// 	let chatType = msg.chat.type;
// 	let fromID = msg.from.id;
// 	let response = match[1];

// 	// Check if the user writes to the bot in private, this causes the command not to work in groups.
// 	if (chatType == 'private') {
// 		// Buttons for the choice of message forwarding.
// 		bot.sendMessage(chatID, '¿A dónde quieres enviar el mensaje?', {
// 			parse_mode: 'Markdown',
// 			reply_markup: {
// 				inline_keyboard: [
// 					[
// 						{ text: 'TeleMAC', callback_data: 'teleMAC' },
// 						{ text: 'Admision MAC 2020', callback_data: 'admisionMAC' },
// 					],
// 					[{ text: 'Cancelar', callback_data: 'cancel' }],
// 				],
// 			},
// 		});

// 		// onCallbackQuery waiting for the callback data of any of the buttons.
// 		bot.on('callback_query', async button => {
// 			let data = button.data;
// 			let msg = button.message;

// 			// -------------------------------------------------- //
// 			// Callback data of teleMAC button.
// 			// -------------------------------------------------- //
// 			if (data == 'teleMAC') {
// 				// Check if the user have permisions to send the message in the group.
// 				if (fromID == ME_ID) {
// 					// The bot edits the previous message presenting two new confirmation buttons.
// 					bot.editMessageText(
// 						`El siguiente mensaje será enviado a TeleMAC:\n\n> *${response}*\n\n¿Seguro que lo quieres enviar?`,
// 						{
// 							parse_mode: 'Markdown',
// 							chat_id: msg.chat.id,
// 							message_id: msg.message_id,
// 							reply_markup: {
// 								inline_keyboard: [
// 									[
// 										{ text: 'Sí', callback_data: 'yes_teleMAC' },
// 										{ text: 'No', callback_data: 'no_teleMAC' },
// 									],
// 								],
// 							},
// 						}
// 					);
// 				}
// 				// If the user does not have permissions, he sends a warning to warn that he cannot send a message to the selected group.
// 				else {
// 					bot.answerCallbackQuery({
// 						force_reply: true,
// 						callback_query_id: button.id,
// 						text: 'Lo siento, pero no tienes permisos para mandar un mensaje para este grupo.',
// 						show_alert: true,
// 					});
// 				}
// 			}

// 			// -------------------------------------------------- //
// 			// Sub-callback data of teleMAC button.
// 			// -------------------------------------------------- //
// 			if (data == 'yes_teleMAC') {
// 				// Send the requested message to the chosen group.
// 				bot.sendMessage(TELEMAC_ID, response);
// 				// The bot edits the previous message notifying that the requested message has already been sent.
// 				bot.editMessageText(
// 					`El siguiente mensaje:\n\n> *${response}*\n\nHa sido enviado exitosamente a TeleMAC.`,
// 					{
// 						parse_mode: 'Markdown',
// 						chat_id: msg.chat.id,
// 						message_id: msg.message_id,
// 					}
// 				);

// 				// A ghost notification to alert that the message was sent.
// 				bot.answerCallbackQuery({
// 					callback_query_id: button.id,
// 					text: 'Mensaje enviado.',
// 					show_alert: false,
// 				});

// 				// Wait 10 seconds before deleting the bot message.
// 				await new Promise(sleep => setTimeout(sleep, 10000));
// 				bot.deleteMessage(chatID, msg.message_id);
// 			}

// 			if (data == 'no_teleMAC') {
// 				// The bot edits the previous message notifying that the sending of the message was canceled.
// 				bot.editMessageText(`Se ha cancelado el envio del mensaje a TeleMAC.`, {
// 					parse_mode: 'Markdown',
// 					chat_id: msg.chat.id,
// 					message_id: msg.message_id,
// 				});

// 				// A ghost notification to alert that the message was not sent.
// 				bot.answerCallbackQuery({
// 					callback_query_id: button.id,
// 					text: 'Mensaje cancelado.',
// 					show_alert: false,
// 				});

// 				// Wait 5 seconds before deleting the bot message.
// 				await new Promise(sleep => setTimeout(sleep, 5000));
// 				bot.deleteMessage(chatID, msg.message_id);
// 			}

// 			// -------------------------------------------------- //
// 			// Callback data of teleMAC button.
// 			// -------------------------------------------------- //
// 			if (data == 'admisionMAC') {
// 				// Check if the user have permisions to send the message in the group.
// 				if (fromID == ME_ID) {
// 					// The bot edits the previous message presenting two new confirmation buttons.
// 					bot.editMessageText(
// 						`El siguiente mensaje será enviado a Admision MAC 2020:\n\n> *${response}*\n\n¿Seguro que lo quieres enviar?`,
// 						{
// 							parse_mode: 'Markdown',
// 							chat_id: msg.chat.id,
// 							message_id: msg.message_id,
// 							reply_markup: {
// 								inline_keyboard: [
// 									[
// 										{ text: 'Sí', callback_data: 'yes_admisionMAC' },
// 										{ text: 'No', callback_data: 'no_admisionMAC' },
// 									],
// 								],
// 							},
// 						}
// 					);
// 				}
// 				// If the user does not have permissions, he sends a warning to warn that he cannot send a message to the selected group.
// 				else {
// 					bot.answerCallbackQuery({
// 						force_reply: true,
// 						callback_query_id: button.id,
// 						text: 'Lo siento, pero no tienes permisos para mandar un mensaje para este grupo.',
// 						show_alert: true,
// 					});
// 				}
// 			}

// 			// -------------------------------------------------- //
// 			// Sub-callback data of teleMAC button.
// 			// -------------------------------------------------- //
// 			if (data == 'yes_admisionMAC') {
// 				// Send the requested message to the chosen group.
// 				bot.sendMessage(ADMISION_ID, response);
// 				// The bot edits the previous message notifying that the requested message has already been sent.
// 				bot.editMessageText(
// 					`El siguiente mensaje:\n\n> *${response}*\n\nHa sido enviado exitosamente a Admision MAC 2020.`,
// 					{
// 						parse_mode: 'Markdown',
// 						chat_id: msg.chat.id,
// 						message_id: msg.message_id,
// 					}
// 				);

// 				// A ghost notification to alert that the message was sent.
// 				bot.answerCallbackQuery({
// 					callback_query_id: button.id,
// 					text: 'Mensaje enviado.',
// 					show_alert: false,
// 				});

// 				// Wait 10 seconds before deleting the bot message.
// 				await new Promise(sleep => setTimeout(sleep, 10000));
// 				bot.deleteMessage(chatID, msg.message_id);
// 			}

// 			if (data == 'no_admisionMAC') {
// 				// The bot edits the previous message notifying that the sending of the message was canceled.
// 				bot.editMessageText(`Se ha cancelado el envio del mensaje a Admision MAC 2020.`, {
// 					parse_mode: 'Markdown',
// 					chat_id: msg.chat.id,
// 					message_id: msg.message_id,
// 				});

// 				// A ghost notification to alert that the message was not sent.
// 				bot.answerCallbackQuery({
// 					callback_query_id: button.id,
// 					text: 'Mensaje cancelado.',
// 					show_alert: false,
// 				});

// 				// Wait 5 seconds before deleting the bot message.
// 				await new Promise(sleep => setTimeout(sleep, 5000));
// 				bot.deleteMessage(chatID, msg.message_id);
// 			}

// 			// -------------------------------------------------- //
// 			// Callback data of cancel button.
// 			// -------------------------------------------------- //
// 			if (data == 'cancel') {
// 				// The bot edits the previous message notifying that the sending of the message was canceled.
// 				bot.editMessageText(`Se ha cancelado el envio del mensaje.`, {
// 					parse_mode: 'Markdown',
// 					chat_id: msg.chat.id,
// 					message_id: msg.message_id,
// 				});
// 				// A ghost notification to alert that the message was not sent.
// 				bot.answerCallbackQuery({
// 					callback_query_id: button.id,
// 					text: 'Mensaje cancelado.',
// 					show_alert: false,
// 				});

// 				// Wait 5 seconds before deleting the bot message.
// 				await new Promise(sleep => setTimeout(sleep, 5000));
// 				bot.deleteMessage(chatID, msg.message_id);
// 			}
// 		});

// 		// Delete the command sent by the user.
// 		bot.deleteMessage(chatID, messageID);
// 	}
// });
