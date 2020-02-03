// ---------------------------------------------------------------------------------------------------- //
// Environment variables.
// ---------------------------------------------------------------------------------------------------- //
require('dotenv').config();

const ADMISION_URL = process.env.ADMISION_URL || undefined;

// ---------------------------------------------------------------------------------------------------- //
// This file stores all the keyboards shown on the telegram board.
// ---------------------------------------------------------------------------------------------------- //
export const preLogin = {
	parse_mode: 'Markdown',
	reply_markup: {
		keyboard: [['Sí', 'No'], ['📊 FAQ 📊']],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const yes_preLogin = {
	parse_mode: 'Markdown',
	reply_markup: {
		keyboard: [['Ya asistí a la reunión, ¿Ahora qué?'], ['No', '📊 FAQ 📊']],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const login = {
	parse_mode: 'Markdown',
	reply_markup: {
		keyboard: [['Iniciar sesión'], ['Atrás']],
		resize_keyboard: true,
		one_time_keyboard: false,
	},
};

export const stupidLogin = {
	parse_mode: 'Markdown',
	reply_markup: {
		keyboard: [['Iniciar sesión', 'No sé que hacer'], ['📊 FAQ 📊']],
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

export const inlineURL = {
	parse_mode: 'Markdown',
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
};
