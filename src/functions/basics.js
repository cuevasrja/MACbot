import bot from '../settings/app';

// Show chat id.
bot.onText(/^\/id/, msg => {
	bot.sendMessage(msg.chat.id, msg.chat.id);
});
