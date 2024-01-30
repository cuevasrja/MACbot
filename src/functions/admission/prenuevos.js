import { deletePrenuevo, getAllPrenuevos, verifyPrenuevoCarnet } from '../../models/prenuevosModel.js';
import { verifyPreparadorID } from '../../models/preparadorModel.js';
import { replyOpts } from '../keyboards.js';
import bot from '../../settings/app.js';
import { removeFromAdmission } from './groupAdmin.js';

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the command /admision@remove to remove a prenuevo from the database.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/admision@remove/, async msg => {
	let chatID = msg.chat.id;
	// We check if the user is preparador.
	if (await verifyPreparadorID(msg.from.id)) {
		bot.sendMessage(chatID, `No tienes permisos para realizar esta acción.`);
		return;
	}
	// We ask the carnet of the prenuevo to be removed.
	bot.sendMessage(chatID, `Escribe el carnet del prenuevo que deseas eliminar. *(XX-XXXXX)*`, replyOpts).then(sended => {
		// We listen to the message with the carnet.
		bot.onReplyToMessage(sended.chat.id, sended.message_id, async msg => {
			let carnet = msg.text.match(/^[0-9]{2}-[0-9]{5}$/g);
			// We check if the carnet is valid.
			if (carnet == null) {
				bot.sendMessage(chatID, `El carnet no es válido.`);
				return;
			}
			// We check if the prenuevo is registered.
			if (!(await verifyPrenuevoCarnet(carnet[0]))) {
				// We remove the prenuevo from the database.
				await deletePrenuevo(carnet[0]);
				await removeFromAdmission(carnet[0]);
				bot.sendMessage(chatID, `Prenuevo eliminado correctamente.`);
			} else {
				bot.sendMessage(chatID, `El prenuevo no se encuentra registrado.`);
			}
		});
	})

});

// ---------------------------------------------------------------------------------------------------- //
// The bot listens to the command /admision@show to show the list of prenuevos.
// ---------------------------------------------------------------------------------------------------- //
bot.onText(/^\/admision@show/, async msg => {
	let chatID = msg.chat.id;
	// We check if the user is preparador.
	if (await verifyPreparadorID(chatID)) {
		bot.sendMessage(chatID, `No tienes permisos para realizar esta acción.`);
		return;
	}
	// We get the list of prenuevos.
	let prenuevos = await getAllPrenuevos();
	let prenuevosList = `*Lista de prenuevos*\n\n`;
	prenuevos.forEach(prenuevo => {
		prenuevosList += `*${prenuevo.name}* - ${prenuevo.carnet} \n`;
	});
	// We send the list of prenuevos.
	bot.sendMessage(chatID, prenuevosList);
});