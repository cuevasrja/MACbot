export const preLogin = {
	parse_mode: 'Markdown',
	reply_markup: {
		keyboard: [['Sí'], ['No']],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const yes_preLogin = {
	parse_mode: 'Markdown',
	reply_markup: {
		keyboard: [['¿Ahora qué?', 'Atrás']],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const login = {
	parse_mode: 'Markdown',
	reply_markup: {
		keyboard: [['💳 Carnet']],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const replyOpts = {
	parse_mode: 'Markdown',
	reply_markup: JSON.stringify({
		force_reply: true,
	}),
};
